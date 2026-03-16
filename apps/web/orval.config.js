import { defineConfig } from 'orval'

export default defineConfig({
  api: {
    output: {
      mode: 'single',
      target: './src/api.ts',
      schemas: './src/schemas',
      client: 'react-query',
    },
    input: 'http://localhost:3001/doc',
  }
})
