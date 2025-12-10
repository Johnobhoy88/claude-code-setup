// backend/functions/generate-token/index.js
import crypto from 'crypto';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

const ddb = new DynamoDBClient({});
const TABLE = process.env.TOKENS_TABLE || 'highlandai_tokens';

export const handler = async (event) => {
  console.log('Generate token request received:', JSON.stringify(event, null, 2));

  try {
    const body = JSON.parse(event.body || '{}');
    const { email, tier = 'onetime', profileId } = body;

    if (!email) {
      return response(400, { error: 'Email is required' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expirationHours = tier === 'onetime' ? 24 : 720;
    const expiresAt = new Date(Date.now() + expirationHours * 60 * 60 * 1000).toISOString();

    await ddb.send(
      new PutItemCommand({
        TableName: TABLE,
        Item: {
          token: { S: token },
          email: { S: email },
          tier: { S: tier },
          used: { BOOL: false },
          expiresAt: { S: expiresAt },
          createdAt: { S: new Date().toISOString() },
          ...(profileId ? { profileId: { S: profileId } } : {}),
        },
      })
    );

    return response(200, { success: true, token, expiresAt, tier });
  } catch (error) {
    console.error('Error generating token:', error);
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
