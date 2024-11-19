export function safeParseJson<T>(data: string): T | null {
  try {
    return JSON.parse(data)
  }
  catch {
    return null
  }
}

export function safeStringify(data: Record<string, unknown>): string | null {
  try {
    return JSON.stringify(data)
  }
  catch {
    return null
  }
}
