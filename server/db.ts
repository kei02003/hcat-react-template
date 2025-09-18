import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema";
import * as authSchema from "../shared/auth-schema";
import * as canonicalSchema from "../shared/canonical-billing-schema";
import * as arSchema from "../shared/ar-schema";
import * as clinicalDenialsSchema from "../shared/clinical-denials-schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ 
  client: pool, 
  schema: { 
    ...schema, 
    ...authSchema,
    ...canonicalSchema,
    ...arSchema,
    ...clinicalDenialsSchema
  } 
});