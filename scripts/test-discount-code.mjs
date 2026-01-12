import 'dotenv/config'
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { nanoid } from 'nanoid'

const connectionString = process.env.DATABASE_URL
const queryClient = postgres(connectionString, { prepare: false, ssl: false, max: 1 })
const db = drizzle(queryClient)

async function testDiscountCode() {
  try {
    console.log('Testing discount code creation...\n')

    // Generate a test discount code
    const code = `WEDDING-${nanoid(6).toUpperCase()}`
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    console.log('1. Creating discount code:', code)

    const insertResult = await queryClient`
      INSERT INTO game_discount_codes (code, discount_percent, score, grade, expires_at, used)
      VALUES (${code}, ${30}, ${850}, ${'S'}, ${expiresAt.toISOString()}, ${false})
      RETURNING *
    `

    console.log('   ✓ Created:', insertResult[0])

    // Test retrieving the code
    console.log('\n2. Retrieving discount code...')
    const selectResult = await queryClient`
      SELECT * FROM game_discount_codes WHERE code = ${code}
    `
    console.log('   ✓ Retrieved:', selectResult[0])

    // Test validation logic
    console.log('\n3. Testing validation logic...')
    const discount = selectResult[0]
    const isValid = !discount.used && new Date() <= new Date(discount.expires_at)
    console.log('   ✓ Valid:', isValid)

    // Test using the code
    console.log('\n4. Marking code as used...')
    const updateResult = await queryClient`
      UPDATE game_discount_codes
      SET used = true, used_at = NOW()
      WHERE code = ${code}
      RETURNING *
    `
    console.log('   ✓ Updated:', updateResult[0])

    console.log('\n✓ All tests passed!')
  } catch (error) {
    console.error('Test failed:', error)
    process.exit(1)
  } finally {
    await queryClient.end()
  }
}

testDiscountCode()
