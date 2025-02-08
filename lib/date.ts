export function displayDate(dateString: string, lang: string): string {
  return Intl.DateTimeFormat(lang, {
    dateStyle: "medium",
  }).format(new Date(dateString));
}
