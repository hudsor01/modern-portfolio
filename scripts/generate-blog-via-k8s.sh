#!/bin/bash
# Generate blog via qwen-text and save to Prisma Postgres
# This runs on the dev server inside k8s cluster

set -e

echo "🚀 Generating RevOps blog via qwen-text..."

# Call Qwen AI to generate blog
RESPONSE=$(curl -s -X POST 'http://qwen-text.ai.svc.cluster.local:8085/v1/chat/completions' \
  -H 'Authorization: Bearer qwen-text-api' \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "Qwen3-4B-Instruct-2507-Q4_K_M.gguf",
    "messages": [
      {
        "role": "system",
        "content": "You are an experienced Revenue Operations (RevOps) professional. Generate blog posts as valid JSON ONLY with no markdown formatting."
      },
      {
        "role": "user",
        "content": "Generate a comprehensive RevOps blog post about Salesloft cadence optimization.\n\nReturn ONLY valid JSON in this EXACT format with NO markdown code blocks:\n{\n  \"title\": \"Building High-Converting Salesloft Cadences That Actually Work\",\n  \"slug\": \"salesloft-cadence-optimization-guide\",\n  \"excerpt\": \"After implementing Salesloft across 5 B2B SaaS companies reply rates improved from 8% to 24%\",\n  \"content\": \"[WRITE A DETAILED 1500-word blog post with Introduction, Problem statement, Solution approach, Implementation steps with specific metrics, Results, and Key takeaways. Use first-person perspective and include specific percentages and numbers throughout.]\",\n  \"category\": \"Sales Enablement\",\n  \"tags\": [\"salesloft\", \"sales-engagement\", \"automation\", \"revops\", \"b2b-saas\"]\n}"
      }
    ],
    "max_tokens": 3500,
    "temperature": 0.7,
    "stream": false
  }')

# Extract content from response
CONTENT=$(echo "$RESPONSE" | jq -r '.choices[0].message.content')

if [ -z "$CONTENT" ] || [ "$CONTENT" = "null" ]; then
  echo "❌ Failed to get AI response"
  echo "Response: $RESPONSE"
  exit 1
fi

# Remove markdown code blocks if present
CLEAN_JSON=$(echo "$CONTENT" | sed 's/```json//g' | sed 's/```//g' | tr -d '\n\r')

echo "✅ AI generated blog post"
echo "📝 Parsing JSON..."

# Parse individual fields
TITLE=$(echo "$CLEAN_JSON" | jq -r '.title')
SLUG=$(echo "$CLEAN_JSON" | jq -r '.slug')
EXCERPT=$(echo "$CLEAN_JSON" | jq -r '.excerpt')
BLOG_CONTENT=$(echo "$CLEAN_JSON" | jq -r '.content')
CATEGORY=$(echo "$CLEAN_JSON" | jq -r '.category')

# Escape single quotes for SQL
TITLE=$(echo "$TITLE" | sed "s/'/''/g")
SLUG=$(echo "$SLUG" | sed "s/'/''/g")
EXCERPT=$(echo "$EXCERPT" | sed "s/'/''/g")
BLOG_CONTENT=$(echo "$BLOG_CONTENT" | sed "s/'/''/g")
CATEGORY=$(echo "$CATEGORY" | sed "s/'/''/g")

echo "Title: $TITLE"
echo "Slug: $SLUG"

# Insert into database via psql
echo "💾 Saving to database..."

PGPASSWORD="sk__h0pfaPeAYGcsm2J2uw0h" psql -h db.prisma.io -p 5432 -U d533fed20f44a10b2b582c5bb6298c1d7a300e09662661b41b6149bd509d764c -d postgres << EOF
INSERT INTO "BlogPost" (
  title,
  slug,
  excerpt,
  content,
  status,
  "authorId",
  "categoryId",
  "createdAt",
  "updatedAt"
)
VALUES (
  '$TITLE',
  '$SLUG',
  '$EXCERPT',
  '$BLOG_CONTENT',
  'DRAFT',
  'cmk7pk9ep0000aqbr3hlfvgeo',
  'cmk7pk9kx0001aqbrupmm61et',
  NOW(),
  NOW()
)
RETURNING id, title, slug;
EOF

echo "✅ Blog saved to database!"
