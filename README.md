# Finnovate-Sales Monorepo

## Local Development

### Database
This project uses a local PostgreSQL DB that is managed through `docker compose`. You can see the `compose.yaml` file at the root directory. To run it, just execute `docker compose up -d` from your terminal in the project's root directory.

### Environment Variables
Each monorepo package has its own `.env.example` in it that should demonstrate what environment variables should be set.

## TODO List
- Added `zod-openai` to automatically create OpenAI specifications for the REST API
- Added `eslint` and configuration to all packages and apps (add global `turborepo` command)
