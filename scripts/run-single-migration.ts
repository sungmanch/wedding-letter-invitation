import 'dotenv/config'
import postgres from 'postgres'
import { readFileSync } from 'fs'
import { join } from 'path'

const connectionString = process.env.DATABASE_URL!

async function runMigration() {
  const sql = postgres(connectionString, { max: 1 })

  try {
    const migrationPath = join(process.cwd(), 'drizzle/migrations/0017_oval_chronomancer.sql')
    const migrationSQL = readFileSync(migrationPath, 'utf-8')

    console.log('Running migration: 0017_oval_chronomancer.sql')
    console.log(migrationSQL)

    // Split by statement-breakpoint and execute each statement
    const statements = migrationSQL
      .split('--> statement-breakpoint')
      .map(s => s.trim())
      .filter(s => s.length > 0)

    for (const statement of statements) {
      console.log('\nExecuting:', statement.substring(0, 50) + '...')
      await sql.unsafe(statement)
    }

    console.log('\n✓ Migration completed successfully!')
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

runMigration()
