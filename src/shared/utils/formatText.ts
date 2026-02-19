// utils/formatText.ts

export function formatLabelText(text: string): string {
  if (!text) return "";

  return text
    .replace(/_/g, " ")                      // Replace underscores with spaces
    .split(" ")                              // Split into words
    .map((word) => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )                                        // Capitalize each word
    .join(" ");                              // Join back into a string
}

export function formatSentenceCase(text: string): string {
  if (!text) return "";

  const formatted = text.replace(/_/g, " ").toLowerCase(); // replace underscores and lowercase
  return formatted.charAt(0).toUpperCase() + formatted.slice(1); // capitalize first letter
}
