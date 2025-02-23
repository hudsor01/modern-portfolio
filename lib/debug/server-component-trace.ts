type ComponentTrace = {
  component: string
  props: Record<string, any>
  isClient: boolean
  serverFunctions: string[]
}

const traces: ComponentTrace[] = []

export function traceComponent(componentName: string, props: Record<string, any>, isClientComponent: boolean) {
  const serverFunctions = Object.entries(props)
    .filter(([_, value]) => typeof value === "function")
    .map(([key]) => key)

  const trace: ComponentTrace = {
    component: componentName,
    props,
    isClient: isClientComponent,
    serverFunctions,
  }

  traces.push(trace)

  if (isClientComponent && serverFunctions.length > 0) {
    console.warn(
      `⚠️ Warning: Server functions detected in Client Component "${componentName}"\n` +
        `The following props are functions that may need 'use server' directive:\n` +
        serverFunctions.map((fn) => `  - ${fn}`).join("\n"),
    )
  }

  return traces
}

export function debugServerComponents() {
  console.log("\n🔍 Server Component Debug Report:")
  console.log("================================")

  traces.forEach((trace, i) => {
    console.log(`\n[${i + 1}] ${trace.component} (${trace.isClient ? "Client" : "Server"} Component)`)

    if (trace.serverFunctions.length > 0) {
      console.log("Functions passed as props:")
      trace.serverFunctions.forEach((fn) => {
        console.log(`  - ${fn}`)
      })
    }
  })

  const clientComponentsWithServerFunctions = traces.filter((t) => t.isClient && t.serverFunctions.length > 0)

  if (clientComponentsWithServerFunctions.length > 0) {
    console.log("\n⛔ Potential Issues Found:")
    console.log("========================")
    clientComponentsWithServerFunctions.forEach((trace) => {
      console.log(`\n${trace.component}:`)
      console.log('Add "use server" directive to these functions:')
      trace.serverFunctions.forEach((fn) => {
        console.log(`  ${fn}: async function() {\n    "use server"\n    // ... function body\n  }`)
      })
    })
  }
}

