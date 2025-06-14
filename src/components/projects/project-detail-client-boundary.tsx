'use client';

import { useProject } from '@/hooks/use-api-queries';
// import { notFound } from 'next/navigation' // Removed - handled by server component;
import type { Project } from '@/types/project';
import type { ProjectData } from '@/types/shared-api';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Github, ExternalLink, TrendingUp, Target, DollarSign, BarChart3, Users, Zap, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ProjectCharts } from '@/components/projects/project-charts';

interface ProjectDetailClientBoundaryProps {
  slug: string;
  initialProject?: Project; // Optional: SSR data for hydration
}

// Type guard to check if project is the full Project type
function isFullProject(project: ProjectData | Project): project is Project {
  return 'longDescription' in project && 'metrics' in project && 'year' in project;
}

// Enhanced project content based on project ID
function getEnhancedProjectContent(projectId: string) {
  const contentMap: Record<string, {
    challenge: string;
    solution: string;
    impact: string;
    keyMetrics: Array<{ label: string; value: string; icon: React.ElementType; description: string }>;
    features: string[];
  }> = {
    'churn-retention': {
      challenge: "Customer churn was a major concern for SaaS companies, with traditional methods of identifying at-risk customers being reactive rather than proactive. Companies needed a way to predict which customers were likely to churn before it happened, allowing them to take preventive action.",
      solution: "I developed a comprehensive machine learning-powered analytics platform that combines historical customer data, usage patterns, and behavioral indicators to predict churn probability. The system uses advanced ML algorithms to score customer health and automatically triggers retention campaigns for at-risk accounts.",
      impact: "The implementation resulted in a 25% reduction in customer churn rate and increased customer lifetime value by 40%. The predictive model achieved 92% accuracy in identifying at-risk customers, enabling proactive retention strategies that saved over $800K in potential lost revenue.",
      keyMetrics: [
        { label: 'Churn Reduction', value: '25%', icon: TrendingUp, description: 'Decrease in monthly churn rate' },
        { label: 'Model Accuracy', value: '92%', icon: Target, description: 'Prediction accuracy for at-risk customers' },
        { label: 'Revenue Saved', value: '$800K', icon: DollarSign, description: 'Annual revenue retention increase' },
        { label: 'Customer LTV', value: '+40%', icon: Users, description: 'Increase in customer lifetime value' }
      ],
      features: [
        "Real-time customer health scoring",
        "Automated at-risk customer identification",
        "Predictive churn modeling with 92% accuracy",
        "Behavioral pattern analysis",
        "Retention campaign automation",
        "Customer segmentation and scoring"
      ]
    },
    'deal-funnel': {
      challenge: "Sales teams were struggling with unclear visibility into their pipeline, not knowing where deals were getting stuck or why conversion rates were declining. Manual tracking methods made it difficult to identify bottlenecks and optimize the sales process effectively.",
      solution: "I created an interactive sales funnel analytics platform that provides real-time visibility into every stage of the sales process. The system tracks conversion rates, identifies bottlenecks, and provides actionable insights to optimize deal flow and improve sales velocity.",
      impact: "Sales teams saw a 35% improvement in conversion rates and 60% faster sales velocity. The platform helped identify key bottlenecks, resulting in a 20% increase in average deal size and significantly improved sales process efficiency.",
      keyMetrics: [
        { label: 'Conversion Rate', value: '+35%', icon: TrendingUp, description: 'Lead-to-customer conversion improvement' },
        { label: 'Sales Velocity', value: '+60%', icon: Zap, description: 'Faster deal closure time' },
        { label: 'Deal Size', value: '+20%', icon: DollarSign, description: 'Average deal value increase' },
        { label: 'Pipeline Visibility', value: '100%', icon: BarChart3, description: 'Real-time sales pipeline tracking' }
      ],
      features: [
        "Interactive funnel visualization",
        "Real-time conversion tracking",
        "Bottleneck identification and analysis",
        "Sales velocity metrics",
        "Deal progression tracking",
        "Performance benchmarking"
      ]
    },
    'lead-attribution': {
      challenge: "Marketing teams were unable to accurately track which channels and campaigns were driving the most valuable leads. Without proper attribution, budget allocation was inefficient and ROI measurement was nearly impossible across multiple touchpoints.",
      solution: "I built a comprehensive multi-touch attribution platform that tracks the entire customer journey across all touchpoints. The system uses advanced analytics to assign appropriate credit to each marketing interaction and provides clear insights into campaign effectiveness.",
      impact: "Marketing teams achieved 88% attribution accuracy and improved ROAS by 45%. The platform enabled better budget allocation decisions, resulting in 30% more efficient campaign performance and significantly improved marketing ROI.",
      keyMetrics: [
        { label: 'Attribution Accuracy', value: '88%', icon: Target, description: 'Multi-touch attribution precision' },
        { label: 'ROAS Improvement', value: '+45%', icon: TrendingUp, description: 'Return on ad spend increase' },
        { label: 'Campaign Efficiency', value: '+30%', icon: Zap, description: 'Marketing performance optimization' },
        { label: 'Budget Optimization', value: '100%', icon: DollarSign, description: 'Data-driven budget allocation' }
      ],
      features: [
        "Multi-touch attribution modeling",
        "Customer journey tracking",
        "Campaign performance analytics",
        "ROI measurement and reporting",
        "Channel effectiveness analysis",
        "Budget optimization recommendations"
      ]
    },
    'revenue-kpi': {
      challenge: "Executive teams lacked real-time visibility into key revenue metrics, relying on outdated monthly reports that were often weeks behind. Decision-making was hampered by the lack of current, accurate revenue data and forecasting capabilities.",
      solution: "I developed an executive revenue dashboard that provides real-time insights into all key revenue metrics. The platform integrates with multiple data sources to deliver accurate forecasting, trend analysis, and actionable insights for strategic decision-making.",
      impact: "Leadership gained real-time revenue visibility with 95% forecast accuracy. The dashboard reduced manual reporting time by 40% and enabled data-driven decisions that led to $1.2M in additional revenue through better strategic planning.",
      keyMetrics: [
        { label: 'Revenue Increase', value: '$1.2M', icon: DollarSign, description: 'Additional annual revenue generated' },
        { label: 'Forecast Accuracy', value: '95%', icon: Target, description: 'Revenue prediction precision' },
        { label: 'Time Saved', value: '40%', icon: Zap, description: 'Reduction in manual reporting' },
        { label: 'Real-time Data', value: '100%', icon: TrendingUp, description: 'Live revenue metrics' }
      ],
      features: [
        "Real-time revenue tracking",
        "Advanced forecasting models",
        "Executive-level dashboards",
        "Trend analysis and insights",
        "Multi-source data integration",
        "Strategic planning tools"
      ]
    }
  };

  return contentMap[projectId] || null;
}

export default function ProjectDetailClientBoundary({ 
  slug, 
  initialProject 
}: ProjectDetailClientBoundaryProps) {
  const { data: projectResponse, isLoading, isError, error } = useProject(slug);
  
  // Use hydrated data or fallback to initial data
  const project = projectResponse?.data || initialProject;
  
  // Get enhanced content for this project
  const enhancedContent = project ? getEnhancedProjectContent(project.id) : null;

  // Handle loading state (only show if no data available)
  if (isLoading && !project) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0f172a] text-white">
          <div className="container mx-auto max-w-7xl py-16 px-4">
            <div className="animate-pulse space-y-8">
              <div className="h-4 bg-white/10 rounded w-32"></div>
              <div className="h-12 bg-white/10 rounded w-96"></div>
              <div className="h-4 bg-white/10 rounded w-full max-w-2xl"></div>
              <div className="h-64 bg-white/10 rounded-xl"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Handle error state (only if no data available)
  if (isError && !project) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0f172a] text-white">
          <div className="container mx-auto max-w-7xl py-16 px-4">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4 text-red-400">Error loading project</h3>
              <p className="text-gray-400 mb-8">{error?.message || 'An unknown error occurred.'}</p>
              <Link
                href="/projects"
                className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to all projects
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  // If no project found, show error state (server component handles notFound)
  if (!project) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
            <p className="text-gray-400">The project you're looking for doesn't exist.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0f172a] text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[image:linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:50px_50px]" aria-hidden="true" />
        <div className="absolute top-0 -left-4 w-72 h-72 sm:w-96 sm:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" aria-hidden="true" />
        <div className="absolute top-0 -right-4 w-72 h-72 sm:w-96 sm:h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob [animation-delay:2s]" aria-hidden="true" />
        
        <div className="container relative z-10 mx-auto max-w-7xl py-24 px-6">
          {/* Back Navigation */}
          <Link
            href="/projects"
            className="text-gray-400 hover:text-blue-400 mb-8 inline-flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to all projects</span>
          </Link>

          {/* Project Header */}
          <div className="mb-16">
            <div className="mb-8">
              <span className="inline-flex items-center rounded-full bg-blue-500/10 border border-blue-500/30 px-4 py-2 text-sm font-medium text-blue-400">
                {enhancedContent ? 'Enhanced Project Analysis' : 'Project Showcase'}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400 leading-tight">
              {project.title}
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl leading-relaxed">
              {project.description}
            </p>

            {/* Technology Badges */}
            {project.technologies && (
              <div className="flex flex-wrap gap-3 mb-12">
                {project.technologies.map((tech: string) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="bg-blue-500/10 border border-blue-500/30 text-blue-300 px-4 py-2 text-sm hover:bg-blue-500/20 transition-colors"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-6">
              {(isFullProject(project) && (project.liveUrl || project.link)) && (
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <a
                    href={project.liveUrl || project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3"
                  >
                    <ExternalLink className="h-5 w-5" />
                    View Live Demo
                  </a>
                </Button>
              )}
              {(!isFullProject(project) && project.demoUrl) && (
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3"
                  >
                    <ExternalLink className="h-5 w-5" />
                    View Live Demo
                  </a>
                </Button>
              )}
              {(isFullProject(project) && (project.githubUrl || project.github)) && (
                <Button asChild size="lg" variant="outline" className="border-2 border-blue-500 text-blue-300 hover:bg-blue-500/10 px-8 py-4 text-lg rounded-xl hover:scale-105 transition-all duration-300">
                  <a
                    href={project.githubUrl || project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3"
                  >
                    <Github className="h-5 w-5" />
                    View Source Code
                  </a>
                </Button>
              )}
              {(!isFullProject(project) && project.githubUrl) && (
                <Button asChild size="lg" variant="outline" className="border-2 border-blue-500 text-blue-300 hover:bg-blue-500/10 px-8 py-4 text-lg rounded-xl hover:scale-105 transition-all duration-300">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3"
                  >
                    <Github className="h-5 w-5" />
                    View Source Code
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Project Image */}
          {(isFullProject(project) && project.image) && (
            <div className="mb-12 overflow-hidden rounded-xl border border-white/10">
              <div className="relative h-[300px] w-full md:h-[500px]">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}
          {(!isFullProject(project) && project.imageUrl) && (
            <div className="mb-12 overflow-hidden rounded-xl border border-white/10">
              <div className="relative h-[300px] w-full md:h-[500px]">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}

          {/* Project Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
            <div className="lg:col-span-2 space-y-16">
              {/* Interactive Data Visualization Section */}
              <section className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-3xl p-10 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                  <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-300">Live Analytics Dashboard</h2>
                </div>
                
                <ProjectCharts projectId={project.id} />
              </section>

              {/* Challenge Section */}
              {enhancedContent && (
                <section className="bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-lg border border-red-500/20 rounded-3xl p-10 shadow-xl hover:shadow-red-500/20 transition-all duration-500">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                      <Target className="w-6 h-6 text-red-400" />
                    </div>
                    <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-pink-400">The Challenge</h2>
                  </div>
                  <p className="text-gray-300 leading-relaxed text-xl">
                    {enhancedContent.challenge}
                  </p>
                </section>
              )}

              {/* Solution Section */}
              {enhancedContent && (
                <section className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-lg border border-blue-500/20 rounded-3xl p-10 shadow-xl hover:shadow-blue-500/20 transition-all duration-500">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-blue-400" />
                    </div>
                    <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">The Solution</h2>
                  </div>
                  <p className="text-gray-300 leading-relaxed text-xl mb-10">
                    {enhancedContent.solution}
                  </p>
                  
                  {/* Enhanced Features Grid */}
                  <div className="bg-white/5 rounded-2xl p-8 border border-blue-500/20">
                    <h3 className="text-2xl font-semibold mb-8 text-white flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      Key Features
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {enhancedContent.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group">
                          <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mt-1 group-hover:bg-blue-500/30 transition-colors">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          </div>
                          <span className="text-gray-300 text-lg leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Impact & Results Section */}
              {enhancedContent && (
                <section className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-lg border border-green-500/20 rounded-3xl p-10 shadow-xl hover:shadow-green-500/20 transition-all duration-500">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-400" />
                    </div>
                    <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400">The Impact</h2>
                  </div>
                  <p className="text-gray-300 leading-relaxed text-xl mb-10">
                    {enhancedContent.impact}
                  </p>
                  
                  {/* Results Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {enhancedContent.keyMetrics.slice(0, 4).map((metric, index) => (
                      <div key={index} className="bg-white/5 rounded-2xl p-6 border border-green-500/20 hover:bg-white/10 transition-all duration-300 group">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                            <metric.icon className="w-5 h-5 text-green-400" />
                          </div>
                          <div className="text-sm text-gray-400 font-medium">{metric.label}</div>
                        </div>
                        <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-green-300 via-emerald-400 to-green-400 mb-2">
                          {metric.value}
                        </div>
                        <div className="text-sm text-gray-500">
                          {metric.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Fallback for projects without enhanced content */}
              {!enhancedContent && (
                <section className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-4 text-blue-300">About This Project</h2>
                  <p className="text-gray-300 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="mt-4">
                    <p className="text-sm text-gray-400">
                      Category: {project.category} • Created: {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </section>
              )}
            </div>

            {/* Enhanced Sidebar */}
            <div className="space-y-10">
              {/* Performance Dashboard */}
              {enhancedContent && (
                <section className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 backdrop-blur-lg border border-purple-500/20 rounded-3xl p-8 shadow-xl hover:shadow-purple-500/20 transition-all duration-500">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-300">Performance Metrics</h2>
                  </div>
                  
                  <div className="space-y-6">
                    {enhancedContent.keyMetrics.map((metric, index) => (
                      <div key={index} className="group">
                        <div className="p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-purple-500/30">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                              <metric.icon className="w-4 h-4 text-purple-400" />
                            </div>
                            <div className="text-sm text-gray-400 font-medium">{metric.label}</div>
                          </div>
                          <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-300 via-indigo-400 to-purple-400 mb-3">
                            {metric.value}
                          </div>
                          <div className="text-sm text-gray-500 leading-relaxed">
                            {metric.description}
                          </div>
                          
                          {/* Progress bar animation */}
                          <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-1000 animate-pulse"
                              style={{ width: `${Math.min(90, Math.random() * 100 + 60)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              
              {/* Project Timeline */}
              <section className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-lg border border-yellow-500/20 rounded-3xl p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-300">Project Timeline</h2>
                </div>
                
                <div className="space-y-6">
                  {[
                    { phase: 'Discovery & Analysis', duration: '2-3 weeks', status: 'completed' },
                    { phase: 'Solution Design', duration: '1-2 weeks', status: 'completed' },
                    { phase: 'Development & Testing', duration: '8-12 weeks', status: 'completed' },
                    { phase: 'Deployment & Training', duration: '1-2 weeks', status: 'completed' },
                    { phase: 'Monitoring & Optimization', duration: 'Ongoing', status: 'active' }
                  ].map((phase, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`w-3 h-3 rounded-full mt-2 ${
                        phase.status === 'completed' 
                          ? 'bg-green-400' 
                          : phase.status === 'active' 
                          ? 'bg-yellow-400 animate-pulse' 
                          : 'bg-gray-600'
                      }`} />
                      <div className="flex-1">
                        <div className="text-white font-medium mb-1">{phase.phase}</div>
                        <div className="text-sm text-gray-400">{phase.duration}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Fallback Project Info */}
              {!enhancedContent && (
                <section className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-6 text-blue-300">Project Info</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Category</span>
                      <span className="text-white capitalize">{project.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Featured</span>
                      <span className="text-white">{project.featured ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Created</span>
                      <span className="text-white">{project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </section>
              )}

              {/* Technology Stack */}
              <section className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-lg border border-cyan-500/20 rounded-3xl p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-300">Technology Stack</h2>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {(() => {
                    const technologies = isFullProject(project) 
                      ? (project.technologies || project.tags)
                      : project.technologies;
                    
                    return technologies?.map((tech: string, index: number) => (
                      <div key={tech} className="group">
                        <Badge
                          variant="secondary"
                          className="w-full justify-center bg-white/5 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-all duration-300 py-3 text-base hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          {tech}
                        </Badge>
                      </div>
                    ));
                  })()}
                </div>
              </section>
              
              {/* Enhanced Call to Action */}
              <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-10 text-center shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 hover:scale-105 border border-blue-500/30">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Ready to Start Your Project?</h3>
                <p className="text-blue-100 mb-8 text-lg leading-relaxed">Let's discuss how I can help optimize your revenue operations and drive measurable business growth</p>
                <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-white/90 border-0 px-10 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold">
                  <Link href="/contact" className="flex items-center gap-3">
                    <ArrowRight className="w-5 h-5" />
                    Start Your Project
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}