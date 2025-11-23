import { readFileSync } from 'fs'
import { join } from 'path'
import { config } from 'dotenv'
import postgres from 'postgres'

// Load .env file
config()

async function runMigration() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    console.error('DATABASE_URL is not set')
    process.exit(1)
  }

  console.log('Original DATABASE_URL length:', databaseUrl.length)
  console.log('DATABASE_URL contains %25:', databaseUrl.includes('%25'))

  // Replace % with %25 if it's been decoded
  const fixedUrl = databaseUrl.replace(/ky2PC%s7-bnYS\?-/g, 'ky2PC%25s7-bnYS%3F-')

  console.log('Fixed URL contains %25:', fixedUrl.includes('%25'))

  // Parse DATABASE_URL manually to avoid decoding issues
  const url = new URL(fixedUrl)

  const sql = postgres({
    host: url.hostname,
    port: parseInt(url.port || '5432'),
    database: url.pathname.slice(1),
    username: url.username,
    password: decodeURIComponent(url.password),
    max: 1,
    ssl: 'require'
  })

  try {
    // Read migration file
    const migrationPath = join(process.cwd(), 'drizzle/migrations/0002_add_rls_policies.sql')
    const migrationSQL = readFileSync(migrationPath, 'utf-8')

    console.log('Running migration: 0002_add_rls_policies.sql')

    // Split by statement-breakpoint and execute each part
    const statements = migrationSQL
      .split('--> statement-breakpoint')
      .map(s => s.trim())
      .filter(s => s.length > 0)

    for (const statement of statements) {
      console.log('Executing:', statement.substring(0, 100) + '...')
      await sql.unsafe(statement)
    }

    console.log('✅ Migration completed successfully')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

runMigration()
