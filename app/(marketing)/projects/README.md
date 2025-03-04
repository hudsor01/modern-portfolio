# Project Structure

Each project should have its own directory in this folder. To enhance the project display in the portfolio, you can create a `metadata.json` file in each project directory with the following structure:

```json
{
  "title": "Project Title",
  "description": "A detailed description of your project that explains what it does and what problem it solves.",
  "image": "/images/projects/your-project-image.jpg",
  "liveUrl": "https://your-project-url.com",
  "githubUrl": "https://github.com/yourusername/project-repo",
  "technologies": ["React", "TypeScript", "Next.js", "etc"],
  "featured": true,
  "features": [
    "Key feature 1",
    "Key feature 2",
    "Key feature 3",
    "Key feature 4"
  ]
}
```

If you don't provide a metadata.json file, the portfolio will use the directory name (converted from kebab-case to Title Case) as the project title and generate default values for other fields.
