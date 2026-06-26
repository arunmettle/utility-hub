import { describe, expect, it } from 'vitest';
import {
  featuredPersonaCollectionSlugs,
  getPersonaCollectionBySlug,
  getPersonaCollectionTools,
  personaCollections,
} from '../src/data/collections';
import { tools } from '../src/data/tools';

describe('persona collections', () => {
  it('maps every curated collection to at least ten unique existing tools', () => {
    const allToolIds = new Set(tools.map((tool) => tool.id));

    for (const collection of personaCollections) {
      expect(collection.toolIds.length).toBeGreaterThanOrEqual(10);
      expect(new Set(collection.toolIds).size).toBe(collection.toolIds.length);

      for (const toolId of collection.toolIds) {
        expect(allToolIds.has(toolId)).toBe(true);
      }
    }
  });

  it('resolves collection tool objects without gaps', () => {
    for (const collection of personaCollections) {
      const resolvedTools = getPersonaCollectionTools(collection);
      expect(resolvedTools).toHaveLength(collection.toolIds.length);
      expect(resolvedTools.map((tool) => tool.id)).toEqual(collection.toolIds);
    }
  });

  it('keeps featured collection slugs valid', () => {
    for (const slug of featuredPersonaCollectionSlugs) {
      expect(getPersonaCollectionBySlug(slug)?.path).toMatch(/^\/collections\//);
    }
  });

  it('includes the required role coverage requested for UtilityHub', () => {
    const slugs = new Set(personaCollections.map((collection) => collection.slug));

    expect(slugs).toEqual(
      new Set([
        'web-designers',
        'web-developers',
        'frontend-developers',
        'backend-developers',
        'business-analysts',
        'manual-testers',
        'automation-testers',
        'performance-testers',
        'load-stress-testers',
        'penetration-testers',
        'devops-engineers',
        'secops-engineers',
        'ai-engineers',
        'product-owners',
        'scrum-masters',
        'data-engineers-and-analysts',
      ]),
    );
  });
});
