# Richard Hudson's Portfolio

A modern, responsive portfolio website built with Next.js, React, TypeScript, and TailwindCSS.

## Features

- Responsive design for all devices
- Static project showcase with detailed project pages
- Resume page with downloadable PDF
- Contact form
- SEO optimized

## Tech Stack

- **Frontend Framework**: Next.js (App Router)
- **UI Library**: React
- **Type Safety**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui components
- **Animations**: CSS transitions and animations

## Project Structure

```
├── app                 # Next.js App Router pages
│   ├── (marketing)     # Marketing pages (projects, about, contact)
│   ├── api             # API routes for contact form
│   └── ...             # Other app pages
├── components          # React components
│   ├── forms           # Form components
│   ├── layout          # Layout components
│   ├── projects        # Project-related components
│   ├── ui              # UI components
│   └── ...             # Other components
├── lib                 # Utility functions and data
│   ├── data            # Static data (projects, resume)
│   ├── config          # Site configuration
│   ├── utils           # Utility functions
│   └── ...             # Other libraries
└── public              # Static assets (images, icons, etc.)
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- Yarn package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/username/portfolio.git
cd portfolio
```

2. Install dependencies:

```bash
yarn install
```

3. Start the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This site is optimized for deployment on Vercel:

```bash
yarn build
```

## Adding Projects

To add new projects, edit the `lib/data/projects.ts` file by adding a new entry to the `projects` array with the following structure:

```typescript
{
  id: "unique-id",
  title: "Project Title",
  slug: "project-slug",
  description: "Project description goes here.",
  image: "/images/project-image.jpg",
  technologies: ["Tech 1", "Tech 2", "Tech 3"],
  githubUrl: "https://github.com/username/project",
  liveUrl: "https://project.example.com",
  featured: true,
  createdAt: "2023-09-01T00:00:00Z",
  updatedAt: "2023-09-01T00:00:00Z"
}
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
