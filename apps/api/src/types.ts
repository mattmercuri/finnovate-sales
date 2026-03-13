import type { DB } from "./db.js";
import type { EnvironmentConfig } from "./environment.js";

export type Variables = {
  environmentConfig: EnvironmentConfig;
  db: DB
};
