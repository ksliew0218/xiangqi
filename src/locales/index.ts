import { en, type Messages } from "./en";
import { ms } from "./ms";
import { zhCN } from "./zh-CN";

export type LocaleCode = "en" | "zh-CN" | "ms";

export const defaultLocale: LocaleCode = "en";

export const localeCodes: LocaleCode[] = ["en", "zh-CN", "ms"];

export const messagesByLocale: Record<LocaleCode, Messages> = {
  en,
  "zh-CN": zhCN,
  ms,
};

export { en, zhCN, ms };
export type { Messages } from "./en";
