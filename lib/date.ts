export function displayDate(dateString: string, lang: string): string {
  let date = new Date(dateString);

  if (lang === "zh") {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  }

  return `${date.toDateString()}`;
}
