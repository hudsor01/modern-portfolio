/**
 * Script to add STAR Impact Analysis section to all dedicated project pages
 */
import * as fs from 'fs';
import * as path from 'path';

const projectPages = [
  'partnership-program-implementation',
  'commission-optimization',
  'multi-channel-attribution',
  'revenue-operations-center',
  'customer-lifetime-value',
  'partner-performance',
  'cac-unit-economics',
  'churn-retention',
  'deal-funnel',
  'lead-attribution',
  'revenue-kpi',
];

// STAR section code to inject
const starSectionCode = `
        {/* STAR Impact Analysis */}
        <section className="py-16 bg-gradient-to-b from-transparent to-black/20">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  STAR Impact Analysis
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Tracking project progression from Situation through Action to measurable Results
                </p>
              </div>

              <div className="glass rounded-3xl p-8">
                <STARAreaChart
                  data={starData}
                  title="Project Progression Metrics"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-6 glass rounded-2xl">
                  <div className="text-sm text-primary/70 mb-2">Situation</div>
                  <div className="text-lg font-bold text-white">Initial Assessment</div>
                </div>
                <div className="text-center p-6 glass rounded-2xl">
                  <div className="text-sm text-green-400/70 mb-2">Task</div>
                  <div className="text-lg font-bold text-white">Goal Definition</div>
                </div>
                <div className="text-center p-6 glass rounded-2xl">
                  <div className="text-sm text-amber-400/70 mb-2">Action</div>
                  <div className="text-lg font-bold text-white">Implementation</div>
                </div>
                <div className="text-center p-6 glass rounded-2xl">
                  <div className="text-sm text-cyan-400/70 mb-2">Result</div>
                  <div className="text-lg font-bold text-white">Measurable Impact</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
`;

// Import statements to add
const importSTARChart = `import { STARAreaChart } from '@/components/projects/STARAreaChart'`;
const importProjectData = `import { ProjectDataManager } from '@/lib/server/project-data-manager'`;

for (const projectSlug of projectPages) {
  const filePath = path.join(
    process.cwd(),
    'src/app/projects',
    projectSlug,
    'page.tsx'
  );

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skipping ${projectSlug} - file not found`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf-8');

  // Check if already has STAR section
  if (content.includes('STAR Impact Analysis')) {
    console.log(`✓ ${projectSlug} already has STAR section`);
    continue;
  }

  // Add imports after existing imports
  if (!content.includes('STARAreaChart')) {
    const lastImportIndex = content.lastIndexOf('import ');
    const endOfLastImport = content.indexOf('\n', lastImportIndex);
    content =
      content.slice(0, endOfLastImport + 1) +
      importSTARChart +
      '\n' +
      content.slice(endOfLastImport + 1);
  }

  // Add STAR data fetching
  const starDataCode = `
// Fetch STAR data for this project
const projectData = await ProjectDataManager.getProjectBySlug('${projectSlug}')
const starData = projectData?.starData || {
  situation: { phase: 'Situation', impact: 20, efficiency: 15, value: 10 },
  task: { phase: 'Task', impact: 45, efficiency: 40, value: 35 },
  action: { phase: 'Action', impact: 75, efficiency: 80, value: 70 },
  result: { phase: 'Result', impact: 95, efficiency: 98, value: 92 },
}
`;

  // Find a good insertion point - after the last section, before Footer
  const footerIndex = content.indexOf('<Footer');
  if (footerIndex === -1) {
    console.log(`⚠️  Could not find Footer in ${projectSlug}`);
    continue;
  }

  // Insert STAR section before Footer
  content =
    content.slice(0, footerIndex) +
    '\n' +
    starSectionCode +
    '\n        ' +
    content.slice(footerIndex);

  // Write updated content
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ Added STAR section to ${projectSlug}`);
}

console.log('\n✨ STAR sections added to all project pages!');
