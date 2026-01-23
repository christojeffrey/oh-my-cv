// Utility for dynamic CSS - basic implementation
export function generateDynamicCss(variables: Record<string, string>): string {
  return Object.entries(variables)
    .map(([key, value]) => `--${key}: ${value};`)
    .join('\n')
}