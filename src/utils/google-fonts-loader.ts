// Google Fonts loader utility
export function loadGoogleFont(family: string, weights: string[] = ["400"]): string {
  const weightsStr = weights.join(",");
  return `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weightsStr}&display=swap`;
}
