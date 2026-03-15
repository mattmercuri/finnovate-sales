import type { DB } from "./db";
import type { EnvironmentConfig } from "./environment";

export type Variables = {
  environmentConfig: EnvironmentConfig;
  db: DB
};
