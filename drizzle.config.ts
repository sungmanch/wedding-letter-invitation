import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: [
    './src/lib/db/schema.ts',
    './src/lib/db/invitation-schema.ts',
    './src/lib/db/template-schema.ts',
    './src/lib/db/super-editor-schema.ts',
    './src/lib/super-editor-v2/schema/index.ts',
  ],
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
})
