import { ReactNode } from "react";

export interface LanguageDictEntry {
  displayText: string;
  displayIcon: ReactNode;
  localeString: string;
}

export const languageDict: { [language: string]: LanguageDictEntry } = {
  en: {
    displayText: "English",
    displayIcon: "🇬🇧",
    localeString: "enUS",
  },
  de: {
    displayText: "Deutsch",
    displayIcon: "🇩🇪",
    localeString: "deDE",
  },
  zh: {
    displayText: "中文",
    displayIcon: "🇹🇼",
    localeString: "zhTW",
  },
};
