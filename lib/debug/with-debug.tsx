import type React from "react"
import { traceComponent } from "./server-component-trace"

export function withDebug<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    name?: string
    isClientComponent?: boolean
  } = {},
) {
  const componentName = options.name || Component.displayName || Component.name
  const isClient = options.isClientComponent ?? false

  return function DebugWrapper(props: P) {
    traceComponent(componentName, props, isClient)
    return <Component {...props} />
  }
}

