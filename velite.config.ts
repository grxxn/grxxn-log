import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode, {
  type Options as PrettyCodeOptions,
} from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { defineCollection, defineConfig, s } from "velite";

const posts = defineCollection({
  name: "Post",
  pattern: "posts/**/index.mdx",
  schema: s
    .object({
      title: s.string().max(99),
      slug: s.slug("posts"),
      path: s.path(),
      date: s.isodate(),
      updated: s.isodate().optional(),
      description: s.string().max(200),
      thumb: s.string().max(24),
      tags: s.array(s.string()).default([]),
      series: s.string().optional(),
      draft: s.boolean().default(false),
      toc: s.toc(),
      metadata: s.metadata(),
      body: s.mdx(),
    })
    .transform((data) => ({ ...data, permalink: `/posts/${data.slug}` })),
});

const prettyCodeOptions = {
  theme: { light: "github-light", dark: "github-dark" },
  keepBackground: false,
} satisfies PrettyCodeOptions;

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { posts },
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, prettyCodeOptions],
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
    ],
  },
});
