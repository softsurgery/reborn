export function splitCamelOrPascal(input: string): string {
  return input.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^([A-Z])/, "$1");
}

export function sanitizeText(text: string): string {
  if (!text) return "";

  return text
    .replace(/<strong>(.*?)<\/strong>/gi, '"$1"')
    .replace(/<em>(.*?)<\/em>/gi, "'$1'")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .trim();
}
