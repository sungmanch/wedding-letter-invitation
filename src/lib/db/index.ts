import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import * as invitationSchema from './invitation-schema'
import * as templateSchema from './template-schema'
import * as superEditorSchema from './super-editor-schema'
import * as superEditorV2Schema from '../super-editor-v2/schema/db-schema'

// Create postgres connection
const connectionString = process.env.DATABASE_URL!

// For query purposes
const queryClient = postgres(connectionString, {
  prepare: false, // 로컬에서는 prepared statements 활성화로 성능 향상
  ssl: false,
  max: 20, // 연결 풀 크기
  idle_timeout: 20,
})

// Combine all schemas
const allSchemas = {
  ...schema,
  ...invitationSchema,
  ...templateSchema,
  ...superEditorSchema,
  ...superEditorV2Schema,
}

// Create drizzle database instance with schema
export const db = drizzle(queryClient, { schema: allSchemas })

// Export schema for convenience
export * from './schema'
export * from './invitation-schema'
export * from './template-schema'
export * from './super-editor-schema'
export * from '@/lib/super-editor-v2/schema'
