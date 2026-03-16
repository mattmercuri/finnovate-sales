import { defineConfig } from 'orval'

export default defineConfig({
  api: {
    output: {
      mode: 'tags-split',
      target: './src/api.ts',
      schemas: './src/_schemas',
      client: 'react-query',
    },
    input: 'http://localhost:3001/doc',
  }
})
