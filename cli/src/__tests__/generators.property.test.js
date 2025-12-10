/**
 * Property-based tests for CLAUDE.md generators
 * 
 * **Feature: claude-setup-v2, Property 6: CLAUDE.md contains required sections**
 * **Feature: claude-setup-v2, Property 7: Paid tier CLAUDE.md includes framework content**
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import fc from 'fast-check';
import { renderTemplate, getTemplate, mergeClaudeMd } from '../generators.js';

// Generator for non-whitespace strings (avoids edge cases with whitespace)
// Ensures string equals its trimmed version (no leading/trailing whitespace)
const nonWhitespaceString = (opts = {}) => 
  fc.string({ minLength: 1, ...opts })
    .filter(s => s.trim().length > 0 && s === s.trim() && !s.includes('{{') && !s.includes('}}'));

// Generator for valid section titles (no special chars, no whitespace issues)
// Must equal its trimmed version
const sectionTitleGen = fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9-]{0,29}$/)
  .filter(s => s.trim().length > 0 && s === s.trim());

// Generator for valid framework names (avoid JS prototype methods)
const frameworkNameGen = fc.stringMatching(/^[a-z][a-z0-9-]{0,29}$/)
  .filter(s => !['nextjs', 'python-ml', 'generic', 'default', 'toString', 'valueOf', 'constructor', 'hasOwnProperty'].includes(s));

describe('generators - property tests', () => {
  /**
   * **Feature: claude-setup-v2, Property 6: CLAUDE.md contains required sections**
   * **Validates: Requirements 6.1, 6.2, 6.3, 6.4**
   * 
   * For any generated CLAUDE.md, the content SHALL include:
   * project context, coding standards, tool usage instructions, and MCP-specific guidance.
   */
  describe('Property 6: CLAUDE.md contains required sections', () => {
    it('should include Project Overview section in default template', () => {
      fc.assert(
        fc.property(
          fc.array(nonWhitespaceString({ maxLength: 20 }), { minLength: 1, maxLength: 5 }),
          (mcps) => {
            const template = getTemplate('default');
            const result = renderTemplate(template, { mcps, skills: [] });
            return result.includes('Project Overview');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include MCP Usage Guide section in default template', () => {
      fc.assert(
        fc.property(
          fc.array(nonWhitespaceString({ maxLength: 20 }), { minLength: 1, maxLength: 5 }),
          (mcps) => {
            const template = getTemplate('default');
            const result = renderTemplate(template, { mcps, skills: [] });
            return result.includes('MCP Usage Guide');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include Coding Conventions section in default template', () => {
      fc.assert(
        fc.property(
          fc.array(nonWhitespaceString({ maxLength: 20 }), { minLength: 1, maxLength: 5 }),
          (mcps) => {
            const template = getTemplate('default');
            const result = renderTemplate(template, { mcps, skills: [] });
            return result.includes('Coding Conventions');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should render template with all provided MCPs', () => {
      fc.assert(
        fc.property(
          fc.array(nonWhitespaceString({ maxLength: 30 }), { minLength: 1, maxLength: 10 }),
          (mcps) => {
            const template = '{{#mcps}}MCP: {{.}}\n{{/mcps}}';
            const result = renderTemplate(template, { mcps });
            
            // All MCPs should appear in output
            return mcps.every(mcp => result.includes(`MCP: ${mcp}`));
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should render template with all provided skills', () => {
      fc.assert(
        fc.property(
          fc.array(nonWhitespaceString({ maxLength: 30 }), { minLength: 1, maxLength: 10 }),
          (skills) => {
            const template = '{{#skills}}Skill: {{.}}\n{{/skills}}';
            const result = renderTemplate(template, { skills });
            
            // All skills should appear in output
            return skills.every(skill => result.includes(`Skill: ${skill}`));
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle empty arrays with negative sections', () => {
      fc.assert(
        fc.property(
          fc.constant([]),
          (emptyArray) => {
            const template = '{{#items}}Has items{{/items}}{{^items}}No items{{/items}}';
            const result = renderTemplate(template, { items: emptyArray });
            
            // Empty array should trigger negative section
            return result === 'No items';
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle non-empty arrays with positive sections', () => {
      fc.assert(
        fc.property(
          fc.array(nonWhitespaceString(), { minLength: 1, maxLength: 5 }),
          (items) => {
            const template = '{{#items}}Item{{/items}}{{^items}}Empty{{/items}}';
            const result = renderTemplate(template, { items });
            
            // Non-empty array should trigger positive section
            return result.includes('Item') && !result.includes('Empty');
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: cli-tool, Property 11: Template selection matches framework**
   * **Validates: Requirements 6.3**
   * 
   * For any detected framework, the CLAUDE.md generator SHALL use
   * the corresponding template from the playbooks.
   */
  describe('Property 11: Template selection matches framework', () => {
    it('should return nextjs template for nextjs framework', () => {
      fc.assert(
        fc.property(
          fc.constant('nextjs'),
          (framework) => {
            const template = getTemplate(framework);
            return typeof template === 'string' && template.includes('Next.js');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return python-ml template for python-ml framework', () => {
      fc.assert(
        fc.property(
          fc.constant('python-ml'),
          (framework) => {
            const template = getTemplate(framework);
            return typeof template === 'string' && template.includes('Python');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return default template for unknown frameworks', () => {
      fc.assert(
        fc.property(
          frameworkNameGen,
          (framework) => {
            const template = getTemplate(framework);
            // Unknown frameworks should get default template (which is a string)
            return typeof template === 'string' && template.includes('Highland AI');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should always return a non-empty template', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant('nextjs'),
            fc.constant('python-ml'),
            fc.constant('generic'),
            fc.constant('default'),
            frameworkNameGen
          ),
          (framework) => {
            const template = getTemplate(framework);
            return typeof template === 'string' && template.length > 0;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: cli-tool, Property 12: Merge preserves both contents**
   * **Validates: Requirements 6.4**
   * 
   * For any existing CLAUDE.md content and new generated content,
   * the merge operation SHALL preserve all sections from both sources.
   */
  describe('Property 12: Merge preserves both contents', () => {
    it('should preserve unique sections from existing content', () => {
      fc.assert(
        fc.property(
          sectionTitleGen,
          nonWhitespaceString({ maxLength: 100 }),
          (sectionTitle, sectionContent) => {
            const existing = `# CLAUDE.md\n\n## ${sectionTitle}\n\n${sectionContent}\n`;
            const generated = `# CLAUDE.md\n\n## Project Overview\n\nNew content.\n`;
            
            const merged = mergeClaudeMd(existing, generated);
            
            // Existing unique section should be preserved
            return merged.includes(sectionTitle);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include new sections from generated content', () => {
      fc.assert(
        fc.property(
          sectionTitleGen.filter(s => s !== 'Existing'),
          (newSection) => {
            const existing = `# CLAUDE.md\n\n## Existing\n\nExisting content.\n`;
            const generated = `# CLAUDE.md\n\n## ${newSection}\n\nNew content.\n`;
            
            const merged = mergeClaudeMd(existing, generated);
            
            // New section should be added
            return merged.includes(newSection);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should combine content in shared sections without losing data', () => {
      fc.assert(
        fc.property(
          nonWhitespaceString({ maxLength: 50 }),
          nonWhitespaceString({ maxLength: 50 }),
          (existingItem, newItem) => {
            const existing = `# CLAUDE.md\n\n## Items\n\n- ${existingItem}\n`;
            const generated = `# CLAUDE.md\n\n## Items\n\n- ${newItem}\n`;
            
            const merged = mergeClaudeMd(existing, generated);
            
            // Both items should be present (if they're different after trimming)
            const existingTrimmed = existingItem.trim();
            const newTrimmed = newItem.trim();
            if (existingTrimmed !== newTrimmed) {
              return merged.includes(existingTrimmed) && merged.includes(newTrimmed);
            }
            return merged.includes(existingTrimmed);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should always produce valid markdown with CLAUDE.md header', () => {
      fc.assert(
        fc.property(
          nonWhitespaceString({ minLength: 10, maxLength: 200 }),
          nonWhitespaceString({ minLength: 10, maxLength: 200 }),
          (existing, generated) => {
            // Ensure inputs are valid CLAUDE.md format
            const existingMd = `# CLAUDE.md\n\n## Section1\n\n${existing}\n`;
            const generatedMd = `# CLAUDE.md\n\n## Section2\n\n${generated}\n`;
            
            const merged = mergeClaudeMd(existingMd, generatedMd);
            
            // Result should start with CLAUDE.md header
            return merged.startsWith('# CLAUDE.md');
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
