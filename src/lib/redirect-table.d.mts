export interface Redirect {
  source: string
  destination: string
}

export function buildRedirectTable(input: {
  handWritten: ReadonlyArray<{ source: string; destination: string }>
  renames: Readonly<Record<string, string>>
  retired: Readonly<Record<string, string>>
}): ReadonlyArray<Readonly<Redirect>>
