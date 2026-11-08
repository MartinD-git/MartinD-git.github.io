import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { categories } from "./data/site";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: ({ image }) => {
    const picture = z.object({ src: image(), alt: z.string().min(1) });
    return z.object({
      title: z.string().min(1),
      year: z.union([z.number().int(), z.string().min(1)]),
      categories: z.array(
        z.string().refine((id) => categories.some((category) => category.id === id), "Add this category to src/data/site.ts first")
      ),
      order: z.number().default(100),
      draft: z.boolean().default(false),
      overview: z.string().min(1),
      thumbnail: picture.extend({ fit: z.enum(["cover", "contain"]).default("cover") }).optional(),
      preview: z.string().startsWith("/").optional(),
      github: z.url().optional(),
      report: z.string().startsWith("/").optional(),
      links: z.array(z.object({ label: z.string().min(1), url: z.url() })).default([]),
      media: z
        .array(
          z.discriminatedUnion("type", [
            picture.extend({ type: z.literal("image"), caption: z.string().optional() }),
            z.object({
              type: z.literal("video"),
              src: z.string().startsWith("/"),
              alt: z.string().min(1),
              poster: image().optional(),
              caption: z.string().optional(),
            }),
          ])
        )
        .default([]),
    });
  },
});

export const collections = { projects };
