/**
 * Copy the LLM guide to clipboard
 */
export async function copyLLMGuideToClipboard(): Promise<boolean> {
  const { default: guide } = await import('./llm-guide.md?raw');
  await navigator.clipboard.writeText(guide);
  return true;
}
