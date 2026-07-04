import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/*
 * Every project MDX file must satisfy this schema or the build fails —
 * a case study can't ship with a missing stack line or summary.
 * The file name becomes the URL: partmatch.mdx → /building/partmatch
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    year: z.string(),
    status: z.enum(['live', 'in progress', 'exploring', 'retired']),
    stack: z.array(z.string()),
    link: z.string().url().optional(),
    order: z.number().default(0),
  }),
});

/*
 * Ingredients live in frontmatter (structured, so the servings slider can
 * scale them); the method lives in the MDX body (prose, rendered statically).
 * amount: null means "not scalable" — things like "salt, to taste".
 */
const recipes = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/recipes' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    baseServings: z.number(),
    time: z.string(),
    ingredients: z.array(
      z.object({
        amount: z.number().nullable().default(null),
        unit: z.string().optional(),
        item: z.string(),
      })
    ),
  }),
});

export const collections = { projects, recipes };
