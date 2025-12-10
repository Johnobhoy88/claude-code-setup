// backend/functions/analyze-project/index.js
import Anthropic from '@anthropic-ai/sdk';
import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const ddb = new DynamoDBClient({});
const TABLE = process.env.TOKENS_TABLE || 'highlandai_tokens';
const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
const anthropicModel = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022';
const anthropic = anthropicApiKey ? new Anthropic({ apiKey: anthropicApiKey }) : null;

// Minimal KB-driven recommendations; expand as needed
const BASE_MCPS = [
  { name: 'filesystem', package: '@modelcontextprotocol/server-filesystem', required: true },
  { name: 'memory', package: '@modelcontextprotocol/server-memory', required: true },
  { name: 'fetch', package: '@modelcontextprotocol/server-fetch', required: true },
  { name: 'context7', package: '@upstash/context7-mcp', required: false },
];
const FRAMEWORK_DEFAULTS = {
  nextjs: ['puppeteer'],
  react: ['puppeteer'],
  python: ['python', 'terminal'],
  fastapi: ['python', 'terminal'],
  django: ['python', 'terminal'],
  node: ['terminal'],
};
const INTEGRATION_MCPS = {
  github: { name: 'github', package: '@modelcontextprotocol/server-github', required: false },
  gitlab: { name: 'gitlab', package: '@modelcontextprotocol/server-gitlab', required: false },
  bitbucket: { name: 'bitbucket', package: '@modelcontextprotocol/server-bitbucket', required: false },
  slack: { name: 'slack', package: '@modelcontextprotocol/server-slack', required: false },
  notion: { name: 'notion', package: '@modelcontextprotocol/server-notion', required: false },
  aws: { name: 'aws', package: '@modelcontextprotocol/server-aws', required: false },
  gcp: { name: 'gcp', package: '@modelcontextprotocol/server-gcp', required: false },
  azure: { name: 'azure', package: '@modelcontextprotocol/server-azure', required: false },
};

const CLAUDE_TEMPLATE = ({ framework, mcps, buildCommand, testCommand }) => {
  const mcpList = mcps.map((m) => `- **${m.name}** (${m.package})`).join('\n');
  return `# CLAUDE.md

## Project Overview
Framework: ${framework || 'generic'}.

## Commands
- Build: ${buildCommand || 'npm run build'}
- Test: ${testCommand || 'npm test'}

## MCPs
${mcpList}

## Usage Guide
- Use filesystem for file edits, memory for decisions, fetch/context7 for docs.
- Run tests after changes with the test command above.
`;
};

const MCP_CONFIG = (mcps) => ({
  mcpServers: mcps.reduce((acc, m) => {
    acc[m.name] = { command: 'npx', args: ['-y', m.package] };
    return acc;
  }, {}),
});

function mergeMcps(base, extras = []) {
  const map = new Map();
  [...base, ...extras].forEach((m) => {
    if (!map.has(m.name)) map.set(m.name, m);
  });
  return Array.from(map.values());
}

function buildRecommendations(profile, textInput) {
  const framework = profile?.framework || detectFramework(textInput);
  const useCases = [];
  const integrations = profile?.integrations || [];
  const base = [...BASE_MCPS];
  const defaults = FRAMEWORK_DEFAULTS[framework] || [];
  const defaultMcps = defaults
    .map((name) => {
      if (name === 'puppeteer') return { name: 'puppeteer', package: '@anthropic/puppeteer-mcp', required: false };
      if (name === 'terminal') return { name: 'terminal', package: '@modelcontextprotocol/server-terminal', required: false };
      if (name === 'python') return { name: 'python', package: '@modelcontextprotocol/server-python', required: false };
      return null;
    })
    .filter(Boolean);

  const integrationMcps = integrations.map((i) => INTEGRATION_MCPS[i]).filter(Boolean);
  const mcps = mergeMcps(base, [...defaultMcps, ...integrationMcps]);

  return {
    framework,
    mcps,
    integrations,
    useCases,
    skills: [],
    template: framework,
    buildCommand: profile?.buildCommand,
    testCommand: profile?.testCommand,
  };
}

function detectFramework(text = '') {
  const t = (text || '').toLowerCase();
  if (t.includes('next')) return 'nextjs';
  if (t.includes('react')) return 'react';
  if (t.includes('fastapi')) return 'fastapi';
  if (t.includes('django')) return 'django';
  if (t.includes('python')) return 'python';
  if (t.includes('node') || t.includes('express')) return 'node';
  return 'generic';
}

async function fetchProfile(profileId) {
  if (!profileId) return null;
  const item = await ddb.send(
    new GetItemCommand({
      TableName: TABLE,
      Key: { token: { S: `profile-${profileId}` } },
    })
  );
  if (!item.Item) return null;
  const data = unmarshall(item.Item);
  if (data.profileJson) {
    try {
      return JSON.parse(data.profileJson);
    } catch {
      return null;
    }
  }
  return null;
}

async function generateWithAnthropic(promptText) {
  if (!anthropic) return null;
  const message = await anthropic.messages.create({
    model: anthropicModel,
    max_tokens: 400,
    temperature: 0,
    system: 'Return JSON only with keys: framework, template, integrations, useCases, skills, mcps (array of {name,package,required}).',
    messages: [
      {
        role: 'user',
        content: promptText,
      },
    ],
  });
  const text = message?.content?.[0]?.text || '';
  const start = text.indexOf('{');
  if (start === -1) return null;
  return JSON.parse(text.slice(start));
}

export const handler = async (event) => {
  console.log('Analyze project request received');

  try {
    const body = JSON.parse(event.body || '{}');
    const { userInput, tier, token } = body;

    if (!userInput || !token || !tier) {
      return response(400, { error: 'userInput, tier, and token are required' });
    }

    // Validate token from DynamoDB
    const item = await ddb.send(
      new GetItemCommand({
        TableName: TABLE,
        Key: { token: { S: token } },
      })
    );
    if (!item.Item) return response(404, { error: 'Invalid token' });
    const record = unmarshall(item.Item);

    const now = Date.now();
    if (record.expiresAt && now > new Date(record.expiresAt).getTime()) {
      return response(400, { error: 'Token has expired' });
    }
    if (record.tier === 'onetime' && record.used) {
      return response(400, { error: 'Token already used' });
    }

    const profile = await fetchProfile(record.profileId);

    // Build recommendations
    let recommendations = buildRecommendations(profile, userInput);

    if (anthropic) {
      const promptText = `Project description:\n${userInput}\nProfile:${JSON.stringify(profile || {})}\nReturn JSON with keys: framework, template, integrations, useCases, skills, mcps[{name,package,required}].`;
      const ai = await generateWithAnthropic(promptText).catch((err) => {
        console.warn('Anthropic failed, using fallback', err.message);
        return null;
      });
      if (ai && Array.isArray(ai.mcps)) {
        recommendations = {
          framework: ai.framework || recommendations.framework,
          template: ai.template || recommendations.template,
          integrations: ai.integrations || recommendations.integrations,
          useCases: ai.useCases || recommendations.useCases,
          skills: ai.skills || recommendations.skills,
          mcps: ai.mcps.map((m) => ({
            name: m.name,
            package: m.package,
            required: Boolean(m.required),
          })),
          buildCommand: profile?.buildCommand,
          testCommand: profile?.testCommand,
        };
      }
    }

    const claudeMd = CLAUDE_TEMPLATE({
      framework: recommendations.framework,
      mcps: recommendations.mcps,
      buildCommand: recommendations.buildCommand,
      testCommand: recommendations.testCommand,
    });
    const mcpConfig = MCP_CONFIG(recommendations.mcps);
    const usage = {
      summary: 'Use filesystem/memory/fetch/context7; run tests after changes; follow CLAUDE.md conventions.',
      commands: {
        build: recommendations.buildCommand || 'npm run build',
        test: recommendations.testCommand || 'npm test',
      },
    };

    // Mark one-time token as used
    if (record.tier === 'onetime') {
      await ddb.send(
        new UpdateItemCommand({
          TableName: TABLE,
          Key: { token: { S: token } },
          UpdateExpression: 'SET used = :u',
          ExpressionAttributeValues: {
            ':u': { BOOL: true },
          },
        })
      );
    }

    return response(200, {
      framework: recommendations.framework,
      integrations: recommendations.integrations,
      mcps: recommendations.mcps,
      claudeMd,
      mcpConfig,
      usage,
    });
  } catch (error) {
    console.error('Error analyzing project:', error);
    return response(500, { error: 'Internal server error' });
  }
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}
