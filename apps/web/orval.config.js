import { defineConfig } from 'orval'

const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  api: {
    output: {
      mode: 'tags-split',
      target: './src/api',
      schemas: './src/schemas',
      client: 'react-query',
      baseUrl: isProduction ? 'https://api.finnovate-sales.com' : 'http://localhost:3001',
      override: {
        mutator: {
          path: './src/api/custom-fetch.ts',
          name: 'customFetch',
        }
      }
    },
    input: 'http://localhost:3001/doc',
  }
})
