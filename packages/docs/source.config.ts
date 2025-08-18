import { defineDocs, defineConfig } from 'fumadocs-mdx/config'

// Configuration for docs
export const docs = defineDocs({
  dir: 'content/docs',
})

export default defineConfig({
  mdxOptions: {
    // MDX options
  },
})
