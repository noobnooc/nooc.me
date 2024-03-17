import "server-only";

const dictionaries = {
  en: () => import("./en.ts").then((module) => module.default),
  zh: () => import("./zh.ts").then((module) => module.default),
};

export const languageLabels = {
  en: "English",
  zh: "中文",
};

export type Language = keyof typeof languageLabels;

export const dictionaryKeys = Object.keys(dictionaries);

export async function getDictionary(locale = "en") {
  if (!(locale in dictionaries)) {
    throw new Error(`Dictionary for locale '${locale}' not found.`);
  }

  return dictionaries[locale as keyof typeof dictionaries]();
}
