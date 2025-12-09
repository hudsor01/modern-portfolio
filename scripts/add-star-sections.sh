#!/bin/bash

# Array of project slugs and their STAR data
declare -A PROJECTS=(
  ["commission-optimization"]="25,20,15 50,45,40 80,85,75 98,95,94"
  ["multi-channel-attribution"]="22,18,12 48,42,38 77,82,72 96,94,93"
  ["revenue-operations-center"]="30,25,20 55,50,45 85,88,80 99,97,95"
  ["customer-lifetime-value"]="28,22,18 52,48,42 82,86,78 97,95,93"
  ["partner-performance"]="24,20,15 50,45,40 78,83,75 95,93,91"
  ["cac-unit-economics"]="26,21,16 51,46,41 80,84,76 96,94,92"
  ["churn-retention"]="27,23,18 53,47,43 81,85,77 97,95,93"
  ["deal-funnel"]="29,24,19 54,49,44 83,87,79 98,96,94"
  ["lead-attribution"]="25,21,17 51,46,42 79,84,76 96,94,92"
  ["revenue-kpi"]="31,26,21 56,51,46 86,89,81 99,97,95"
)

for PROJECT in "${!PROJECTS[@]}"; do
  FILE="src/app/projects/$PROJECT/page.tsx"

  if [ ! -f "$FILE" ]; then
    echo "⚠️  Skipping $PROJECT - file not found"
    continue
  fi

  # Check if already has STAR section
  if grep -q "STAR Impact Analysis" "$FILE"; then
    echo "✓ $PROJECT already has STAR section"
    continue
  fi

  # Parse STAR values
  IFS=' ' read -ra STAR_VALUES <<< "${PROJECTS[$PROJECT]}"
  IFS=',' read -ra SIT <<< "${STAR_VALUES[0]}"
  IFS=',' read -ra TASK <<< "${STAR_VALUES[1]}"
  IFS=',' read -ra ACT <<< "${STAR_VALUES[2]}"
  IFS=',' read -ra RES <<< "${STAR_VALUES[3]}"

  # Add import if not present
  if ! grep -q "STARAreaChart" "$FILE"; then
    # Find last import line
    LAST_IMPORT_LINE=$(grep -n "^import " "$FILE" | tail -1 | cut -d: -f1)
    sed -i.bak "${LAST_IMPORT_LINE}a\\
import { STARAreaChart } from '@/components/projects/STARAreaChart'
" "$FILE"
  fi

  # Add STAR data after imports
  if ! grep -q "const starData" "$FILE"; then
    # Find line after last import
    AFTER_IMPORTS=$(grep -n "^import " "$FILE" | tail -1 | cut -d: -f1)
    AFTER_IMPORTS=$((AFTER_IMPORTS + 1))
    sed -i.bak "${AFTER_IMPORTS}a\\
\\
const starData = {\\
  situation: { phase: 'Situation', impact: ${SIT[0]}, efficiency: ${SIT[1]}, value: ${SIT[2]} },\\
  task: { phase: 'Task', impact: ${TASK[0]}, efficiency: ${TASK[1]}, value: ${TASK[2]} },\\
  action: { phase: 'Action', impact: ${ACT[0]}, efficiency: ${ACT[1]}, value: ${ACT[2]} },\\
  result: { phase: 'Result', impact: ${RES[0]}, efficiency: ${RES[1]}, value: ${RES[2]} },\\
}
" "$FILE"
  fi

  # Add STAR section before Footer
  FOOTER_LINE=$(grep -n "<Footer" "$FILE" | head -1 | cut -d: -f1)
  if [ -n "$FOOTER_LINE" ]; then
    # Insert STAR section before Footer
    sed -i.bak "${FOOTER_LINE}i\\
\\
        {/* STAR Impact Analysis */}\\
        <section className=\"py-16 bg-gradient-to-b from-transparent to-black/20\">\\
          <div className=\"container mx-auto px-4 max-w-6xl\">\\
            <motion.div\\
              initial={{ opacity: 0, y: 30 }}\\
              animate={{ opacity: 1, y: 0 }}\\
              transition={{ duration: 0.6 }}\\
              className=\"space-y-8\"\\
            >\\
              <div className=\"text-center space-y-4\">\\
                <h2 className=\"text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent\">\\
                  STAR Impact Analysis\\
                </h2>\\
                <p className=\"text-muted-foreground text-lg max-w-2xl mx-auto\">\\
                  Tracking project progression from Situation through Action to measurable Results\\
                </p>\\
              </div>\\
\\
              <div className=\"glass rounded-3xl p-8\">\\
                <STARAreaChart\\
                  data={starData}\\
                  title=\"Project Progression Metrics\"\\
                />\\
              </div>\\
\\
              <div className=\"grid grid-cols-1 md:grid-cols-4 gap-4\">\\
                <div className=\"text-center p-6 glass rounded-2xl\">\\
                  <div className=\"text-sm text-primary/70 mb-2\">Situation</div>\\
                  <div className=\"text-lg font-bold text-white\">Initial Assessment</div>\\
                </div>\\
                <div className=\"text-center p-6 glass rounded-2xl\">\\
                  <div className=\"text-sm text-green-400/70 mb-2\">Task</div>\\
                  <div className=\"text-lg font-bold text-white\">Goal Definition</div>\\
                </div>\\
                <div className=\"text-center p-6 glass rounded-2xl\">\\
                  <div className=\"text-sm text-amber-400/70 mb-2\">Action</div>\\
                  <div className=\"text-lg font-bold text-white\">Implementation</div>\\
                </div>\\
                <div className=\"text-center p-6 glass rounded-2xl\">\\
                  <div className=\"text-sm text-cyan-400/70 mb-2\">Result</div>\\
                  <div className=\"text-lg font-bold text-white\">Measurable Impact</div>\\
                </div>\\
              </div>\\
            </motion.div>\\
          </div>\\
        </section>
" "$FILE"

    # Remove backup file
    rm "${FILE}.bak"

    echo "✅ Added STAR section to $PROJECT"
  else
    echo "⚠️  Could not find Footer in $PROJECT"
  fi
done

echo ""
echo "✨ STAR sections added to all project pages!"
