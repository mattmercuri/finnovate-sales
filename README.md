# Finnovate-Sales Monorepo

## Local Development

### Database
This project uses a local PostgreSQL DB that is managed through `docker compose`. You can see the `compose.yaml` file at the root directory. To run it, just execute `docker compose up -d` from your terminal in the project's root directory.

### Environment Variables
Each monorepo package has its own `.env.example` in it that should demonstrate what environment variables should be set.

### Prisma
This project uses Prisma.

### Orval
This project uses Orval to automatically generate the React-Query hooks (and ensure type safety).

## TODO List
- Add `eslint` and configuration to all packages and apps (add global `turborepo` command)
- Ensure that when building the Next app, we first generate the API client and perform typechecks
- Add instructions for Orval and Prisma
- Ask Stephen about route guarding
- Ask Stephen about custom fetch client
- Ask Stephen about error handling within endpoint (come up with approach)
- Add documentation about `/docs`
- Ask LLM about security within auth endpoints
- Ensure that only Finnovate users can get on the platform
- Add refresh tokens to DB and make them revokable
- Add testing
- Try out Orval watch mode
