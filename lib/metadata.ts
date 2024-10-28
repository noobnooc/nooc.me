import {
  defaultLanguage,
  Dictionary,
  dictionaryKeys,
  getDictionary,
  Language,
} from "@/dictionaries";
import { AlternateURLs } from "next/dist/lib/metadata/types/alternative-urls-types";

export async function getAlternateLanguages(
  handler: (dict: Dictionary, lang: Language) => string,
): Promise<AlternateURLs["languages"]> {
  const langEntries = await Promise.all(
    dictionaryKeys.map(async (lang) => {
      const dictionary = await getDictionary(lang);

      return [lang, handler(dictionary, lang)];
    }),
  );

  const defaultLang = langEntries.find(([lang]) => lang === defaultLanguage);

  if (defaultLang) {
    langEntries.push(["x-default", defaultLang[1]]);
  }

  return Object.fromEntries(langEntries);
}
