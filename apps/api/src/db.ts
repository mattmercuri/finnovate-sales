import { createDb } from '@finnovate-sales/db'
import { environmentConfig } from './environment'

const db = createDb(environmentConfig.DATABASE_URL)

export default db
export type DB = typeof db
