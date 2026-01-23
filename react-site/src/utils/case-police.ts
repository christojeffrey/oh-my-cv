// Utility functions from original case-police package
export function casePolice(str: string): string {
  // Basic implementation - convert to title case
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
}