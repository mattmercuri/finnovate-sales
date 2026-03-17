import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    output: {
      mode: 'tags-split',
      target: './src/api',
      schemas: './src/schemas',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/api/custom-fetch.ts',
          name: 'customFetch',
        }
      }
    },
    input: 'http://localhost:3001/doc',
  }
});
