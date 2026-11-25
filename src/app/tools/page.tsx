import { Navbar } from '@/components/layout/navbar'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import { ToolBreadcrumb } from '@/components/tools/tool-breadcrumb'
import { ToolCard } from '@/components/tools/tool-card'
import { generateMetadata as genMeta } from '@/app/shared-metadata'
import { TOOLS_HUB_PATH, tools, toolTrail, trailJsonLdItems } from '@/data/tools'

const TRAIL = toolTrail()

// The root layout reads request headers (CSP nonce), which makes every route
// dynamic unless it opts out. Nothing here varies per request, so serve the
// prerendered HTML like the other static pages.
export const dynamic = 'force-static'

export const metadata = genMeta({
  title: 'RevOps Tools: Pipeline Coverage & Maturity',
  description:
    'Two free RevOps tools: a pipeline coverage calculator driven by win rate and a RevOps maturity scorecard. Both run in your browser with no email required.',
  path: TOOLS_HUB_PATH,
  ogTitle: 'RevOps Tools',
  subtitle: 'Pipeline coverage calculator and maturity scorecard',
  ogAlt: 'RevOps Tools',
})

export default function ToolsPage() {
  return (
    <>
      <BreadcrumbListJsonLd items={trailJsonLdItems(TRAIL)} />

      <div className="min-h-screen bg-background">
        <Navbar />
        <main
          id="main-content"
          tabIndex={-1}
          className="max-w-5xl mx-auto px-6 lg:px-8 pt-24 pb-20 lg:pt-32"
        >
          <header className="mb-10 max-w-3xl">
            <ToolBreadcrumb trail={TRAIL} />
            <h1 className="mb-4">Free RevOps Tools</h1>
            <p>
              Two free revenue operations tools. Each runs in your browser and asks for no email.
            </p>
          </header>

          <ul className="grid gap-6 md:grid-cols-2">
            {tools.map((tool) => (
              <li key={tool.slug}>
                <ToolCard tool={tool} />
              </li>
            ))}
          </ul>
        </main>
      </div>
    </>
  )
}
