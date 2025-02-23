import { sql } from "@vercel/postgres"

async function seedDatabase() {
  try {
    // Create tables
    const createTables = await sql.file("lib/schema.sql")
    console.log("Tables created successfully")

    // Insert sample data
    await sql`
      INSERT INTO users (id, name, email) 
      VALUES ('user_1', 'Richard Hudson Jr', 'richard@example.com')
      ON CONFLICT (id) DO NOTHING;
    `

    await sql`
      INSERT INTO posts (id, title, slug, content, author_id) 
      VALUES (
        'post_1', 
        'Getting Started with RevOps', 
        'getting-started-with-revops',
        'This is a sample post about Revenue Operations...',
        'user_1'
      )
      ON CONFLICT (id) DO NOTHING;
    `

    console.log("Sample data inserted successfully")
  } catch (error) {
    console.error("Error seeding database:", error)
    throw error
  }
}

seedDatabase()
  .then(() => console.log("Database seeded successfully"))
  .catch(console.error)

