import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Github, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fetchProjectById } from '@/lib/actions/projects';
import { getProjects } from '@/lib/data/projects';

// Define our own ProjectPageProps instead of extending PageProps
interface ProjectPageProps {
  params: {
    slug: string;
  };
  searchParams?: Record<string, string | string[] | undefined>;
}

// Generate static params for all projects
export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const project = await fetchProjectById(params.slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.title} | Richard Hudson`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  let project = null;
  try {
    project = await fetchProjectById(params.slug);
    if (!project) {
      notFound();
    }
  } catch (error) {
    console.error('Failed to fetch project:', error);
    notFound();
  }

  return (
    <div className="container mx-auto max-w-7xl py-16 px-4">
      <Link
        href="/projects"
        className="text-gray-500 hover:text-[#0070f3] mb-8 inline-flex items-center gap-1 transition-all"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to all projects</span>
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-[#0070f3] to-[#7461c3] bg-clip-text text-transparent">
          {project.title}
        </h1>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.technologies?.map((tech: string) => (
            <Badge
              key={tech}
              variant="secondary"
              className="bg-[#0070f3]/10 text-[#0070f3] border-0"
            >
              {tech}
            </Badge>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          {project.liveUrl && (
            <Button asChild className="bg-[#0070f3]">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                View Live Project
              </a>
            </Button>
          )}
          {project.githubUrl && (
            <Button asChild variant="outline" className="border-[#0070f3] text-[#0070f3]">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                View Source Code
              </a>
            </Button>
          )}
        </div>
      </div>

      <div className="mb-12 overflow-hidden rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="relative h-[300px] w-full sm:h-[400px] md:h-[500px]">
          <Image
            src={project.image || '/images/project-placeholder.jpg'}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-8">
            <section className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-[#0070f3]">Project Overview</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{project.description}</p>
              <p className="text-gray-700 dark:text-gray-300">
                This project was developed to streamline the revenue operations process and provide
                better visibility into key performance metrics. The solution incorporates data
                visualization, automated reporting, and user-friendly interfaces to make complex
                information accessible to stakeholders at all levels.
              </p>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-[#0070f3]">Key Features</h2>
              <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
                <li>Interactive dashboard for real-time performance monitoring</li>
                <li>Automated reporting and alert system</li>
                <li>Seamless integration with existing CRM systems</li>
                <li>Custom analytics for revenue forecasting</li>
                <li>Role-based access controls for secure data sharing</li>
              </ul>
            </section>

            <section className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-[#0070f3]">Results & Impact</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Implementation of this solution resulted in:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
                <li>40% reduction in time spent on manual reporting tasks</li>
                <li>35% improvement in forecast accuracy</li>
                <li>25% increase in team productivity through process automation</li>
                <li>Improved data-driven decision making across the organization</li>
              </ul>
            </section>
          </div>
        </div>

        <div className="space-y-8">
          <section className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-[#0070f3]">Technologies Used</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Frontend</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>React & Next.js</li>
                  <li>TypeScript</li>
                  <li>Tailwind CSS</li>
                  <li>Data visualization libraries</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Backend</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Node.js</li>
                  <li>PostgreSQL database</li>
                  <li>RESTful API design</li>
                  <li>Cloud deployment</li>
                </ul>
              </div>
            </div>
          </section>

          <div className="bg-gradient-to-r from-[#0070f3] to-[#7461c3] rounded-xl p-8 text-white text-center shadow-lg">
            <p className="text-xl mb-6">Interested in working together on a similar project?</p>
            <Button
              asChild
              variant="outline"
              className="bg-white text-[#0070f3] hover:bg-white/90 border-white"
            >
              <Link href="/contact">Get In Touch</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
