/**
 * Unit tests for CLAUDE.md generators
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { renderTemplate, getTemplate, mergeClaudeMd } from '../generators.js';

describe('generators', () => {
  describe('renderTemplate', () => {
    it('should replace simple variables', () => {
      const template = 'Hello {{name}}!';
      const result = renderTemplate(template, { name: 'World' });
      assert.strictEqual(result, 'Hello World!');
    });

    it('should render array sections', () => {
      const template = '{{#items}}Item: {{.}}\n{{/items}}';
      const result = renderTemplate(template, { items: ['A', 'B', 'C'] });
      assert.strictEqual(result, 'Item: A\nItem: B\nItem: C\n');
    });

    it('should handle empty arrays', () => {
      const template = '{{#items}}Item: {{.}}{{/items}}{{^items}}No items{{/items}}';
      const result = renderTemplate(template, { items: [] });
      assert.strictEqual(result, 'No items');
    });

    it('should handle negative sections for non-empty arrays', () => {
      const template = '{{#items}}Has items{{/items}}{{^items}}No items{{/items}}';
      const result = renderTemplate(template, { items: ['A'] });
      assert.strictEqual(result, 'Has items');
    });
  });

  describe('getTemplate', () => {
    it('should return nextjs template for nextjs', () => {
      const template = getTemplate('nextjs');
      assert.ok(template.includes('Next.js'));
    });

    it('should return python-ml template for python-ml', () => {
      const template = getTemplate('python-ml');
      assert.ok(template.includes('Python'));
    });

    it('should return default template for unknown framework', () => {
      const template = getTemplate('unknown-framework');
      assert.ok(template.includes('Highland AI'));
    });

    it('should return default template for generic', () => {
      const template = getTemplate('generic');
      assert.ok(template.includes('Highland AI'));
    });
  });

  describe('mergeClaudeMd', () => {
    it('should preserve existing sections', () => {
      const existing = `# CLAUDE.md

## Custom Section

My custom content here.

## Project Overview

Old overview.
`;
      const generated = `# CLAUDE.md

## Project Overview

New overview.

## Installed MCPs

- filesystem
`;
      const merged = mergeClaudeMd(existing, generated);
      
      assert.ok(merged.includes('Custom Section'));
      assert.ok(merged.includes('My custom content here'));
    });

    it('should add new sections from generated', () => {
      const existing = `# CLAUDE.md

## Project Overview

Overview content.
`;
      const generated = `# CLAUDE.md

## Project Overview

Overview content.

## New Section

New content.
`;
      const merged = mergeClaudeMd(existing, generated);
      
      assert.ok(merged.includes('New Section'));
      assert.ok(merged.includes('New content'));
    });

    it('should combine content in shared sections', () => {
      const existing = `# CLAUDE.md

## Installed MCPs

- existing-mcp
`;
      const generated = `# CLAUDE.md

## Installed MCPs

- new-mcp
`;
      const merged = mergeClaudeMd(existing, generated);
      
      assert.ok(merged.includes('existing-mcp'));
      assert.ok(merged.includes('new-mcp'));
    });
  });
});
