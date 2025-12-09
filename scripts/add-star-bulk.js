const fs = require('fs');
const path = require('path');

const projects = [
  { slug: 'multi-channel-attribution', impact: [22,18,12, 48,42,38, 77,82,72, 96,94,93] },
  { slug: 'revenue-operations-center', impact: [30,25,20, 55,50,45, 85,88,80, 99,97,95] },
  { slug: 'customer-lifetime-value', impact: [28,22,18, 52,48,42, 82,86,78, 97,95,93] },
  { slug: 'partner-performance', impact: [24,20,15, 50,45,40, 78,83,75, 95,93,91] },
  { slug: 'cac-unit-economics', impact: [26,21,16, 51,46,41, 80,84,76, 96,94,92] },
  { slug: 'churn-retention', impact: [27,23,18, 53,47,43, 81,85,77, 97,95,93] },
  { slug: 'deal-funnel', impact: [29,24,19, 54,49,44, 83,87,79, 98,96,94] },
  { slug: 'lead-attribution', impact: [25,21,17, 51,46,42, 79,84,76, 96,94,92] },
  { slug: 'revenue-kpi', impact: [31,26,21, 56,51,46, 86,89,81, 99,97,95] },
];

const starSectionTemplate = (impact) => `
              {/* STAR Impact Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mt-16 space-y-8"
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
              </motion.div>`;

for (const project of projects) {
  const filePath = path.join(process.cwd(), 'src/app/projects', project.slug, 'page.tsx');

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skipping ${project.slug} - file not found`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf-8');

  // Check if already has STAR section
  if (content.includes('STAR Impact Analysis')) {
    console.log(`✓ ${project.slug} already has STAR section`);
    continue;
  }

  // Add import if not present
  if (!content.includes('STARAreaChart')) {
    const lastImportMatch = content.match(/^import .+$/gm);
    if (lastImportMatch) {
      const lastImport = lastImportMatch[lastImportMatch.length - 1];
      content = content.replace(lastImport, lastImport + "\nimport { STARAreaChart } from '@/components/projects/STARAreaChart'");
    }
  }

  // Add STAR data if not present
  if (!content.includes('const starData')) {
    const [s1,s2,s3, t1,t2,t3, a1,a2,a3, r1,r2,r3] = project.impact;
    const starDataCode = `\nconst starData = {\n  situation: { phase: 'Situation', impact: ${s1}, efficiency: ${s2}, value: ${s3} },\n  task: { phase: 'Task', impact: ${t1}, efficiency: ${t2}, value: ${t3} },\n  action: { phase: 'Action', impact: ${a1}, efficiency: ${a2}, value: ${a3} },\n  result: { phase: 'Result', impact: ${r1}, efficiency: ${r2}, value: ${r3} },\n}\n`;

    // Add after imports
    const afterImports = content.match(/^import .+\n/gm);
    if (afterImports) {
      const lastImportLine = afterImports[afterImports.length - 1];
      content = content.replace(lastImportLine, lastImportLine + starDataCode);
    }
  }

  // Find insertion point - before the final closing divs
  const insertionPattern = /(\s+<\/motion\.div>\s+<\/div>\s+<\/>)/;
  const match = content.match(insertionPattern);

  if (match) {
    content = content.replace(insertionPattern, starSectionTemplate(project.impact) + '\n$1');
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Added STAR section to ${project.slug}`);
  } else {
    console.log(`⚠️  Could not find insertion point in ${project.slug}`);
  }
}

console.log('\n✨ STAR sections added!');
