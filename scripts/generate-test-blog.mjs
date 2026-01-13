#!/usr/bin/env bun
/**
 * Generate a test RevOps blog via direct HTTP call to qwen-text
 * and save to Prisma Postgres database
 */

import { PrismaClient } from '../prisma/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL not found in environment');
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const QWEN_URL = 'http://10.43.230.208:8085/v1/chat/completions';
const AUTHOR_ID = 'cmk7pk9ep0000aqbr3hlfvgeo';
const CATEGORY_ID = 'cmk7pk9kx0001aqbrupmm61et';

async function generateBlog() {
  console.log('🤖 Calling Qwen AI to generate blog post...\n');

  const response = await fetch(QWEN_URL, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer qwen-text-api',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'Qwen3-4B-Instruct-2507-Q4_K_M.gguf',
      messages: [
        {
          role: 'system',
          content: `You are Richard Hudson, a Revenue Operations professional. Write blog posts as valid JSON ONLY with no markdown formatting.

CRITICAL WRITING RULES - Avoid these AI-typical patterns:
- No "Let's dive in", "In conclusion", "In today's world", "game-changer", "cutting-edge", "revolutionize"
- No "seamless", "robust", "leverage", "empower", "unlock", "transform"  
- No "comprehensive guide", "deep dive", "explore together"
- No generic conclusions like "it's not just about X, it's about Y"
- Write like a human: direct, specific, with real examples and numbers
- Use first-person when sharing experience ("I've seen", "In my work")
- Be conversational but professional`
        },
        {
          role: 'user',
          content: `Write a RevOps blog post about Salesloft cadence optimization based on real experience.

Write naturally - avoid AI clichés like "seamless", "game-changer", "let's dive in", "comprehensive guide".
Use specific numbers, real examples, and first-person perspective.

Return ONLY valid JSON in this EXACT format with NO markdown code blocks:
{
  "title": "Building High-Converting Salesloft Cadences That Actually Work",
  "slug": "salesloft-cadence-optimization-guide",
  "excerpt": "After implementing Salesloft across 5 B2B SaaS companies, I've consistently seen one pattern: generic cadences fail, while optimized multi-channel sequences drive 35% higher reply rates.",
  "content": "[WRITE A DETAILED 1500-word blog post with Introduction, Problem statement, Solution approach, Implementation steps with specific metrics, Results, and Key takeaways. Use first-person perspective and include specific percentages and numbers throughout.]",
  "category": "Sales Enablement",
  "tags": ["salesloft", "sales-engagement", "automation", "revops", "b2b-saas"]
}`
        }
      ],
      max_tokens: 3500,
      temperature: 0.7,
      stream: false
    })
  });

  if (!response.ok) {
    throw new Error(`AI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';

  console.log('✅ AI response received\n');
  console.log('Raw content length:', content.length);
  console.log('First 200 chars:', content.substring(0, 200));
  console.log('');

  // Parse JSON from content (remove markdown code blocks if present)
  const cleanContent = content.replace(/```json\n?|```\n?/g, '').trim();

  let blogData;
  try {
    blogData = JSON.parse(cleanContent);
  } catch (e) {
    console.error('❌ Failed to parse JSON from AI response');
    console.error('Clean content:', cleanContent.substring(0, 500));
    throw new Error(`JSON parse error: ${e.message}`);
  }

  // Validate required fields
  if (!blogData.title || !blogData.slug || !blogData.content) {
    throw new Error('AI response missing required fields');
  }

  console.log('📝 Parsed blog data:');
  console.log('  Title:', blogData.title);
  console.log('  Slug:', blogData.slug);
  console.log('  Content length:', blogData.content.length, 'chars');
  console.log('  Category:', blogData.category);
  console.log('  Tags:', blogData.tags?.join(', '));
  console.log('');

  return blogData;
}

async function saveBlog(blogData) {
  console.log('💾 Saving blog to Prisma Postgres...\n');

  const post = await prisma.blogPost.create({
    data: {
      title: blogData.title,
      slug: blogData.slug,
      excerpt: blogData.excerpt || '',
      content: blogData.content,
      status: 'DRAFT',
      authorId: AUTHOR_ID,
      categoryId: CATEGORY_ID,
    },
  });

  console.log('✅ Blog post saved!');
  console.log('  ID:', post.id);
  console.log('  Title:', post.title);
  console.log('  Slug:', post.slug);
  console.log('  Status:', post.status);
  console.log('');

  return post;
}

async function main() {
  try {
    console.log('🚀 Starting blog generation...\n');

    const blogData = await generateBlog();
    const post = await saveBlog(blogData);

    console.log('🎉 SUCCESS! Blog generated and saved to database');
    console.log(`\nView at: http://localhost:3000/blog/${post.slug}`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
