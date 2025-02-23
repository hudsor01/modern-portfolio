import RSS from 'rss';
import { getAllPosts } from './blog';
import { getAllProjects } from './projects';
import { siteConfig } from '@/config/site';

export async function generateBlogFeed() {
  const posts = await getAllPosts();
  const feed = new RSS({
    title: `${siteConfig.name} Blog`,
    description: siteConfig.description,
    site_url: siteConfig.url,
    feed_url: `${siteConfig.url}/rss.xml`,
    language: 'en',
  });

  posts.forEach((post) => {
    feed.item({
      title: post.title,
      description: post.description,
      url: `${siteConfig.url}/blog/${post.slug}`,
      date: post.date,
      author: siteConfig.author.name,
    });
  });

  return feed.xml();
}

export async function generateProjectsFeed() {
  const projects = await getAllProjects();
  const feed = new RSS({
    title: `${siteConfig.name} Projects`,
    description: 'Latest projects and work',
    site_url: siteConfig.url,
    feed_url: `${siteConfig.url}/projects.xml`,
    language: 'en',
  });

  projects.forEach((project) => {
    feed.item({
      title: project.title,
      description: project.description,
      url: `${siteConfig.url}/projects/${project.slug}`,
      date: project.date,
    });
  });

  return feed.xml();
}

