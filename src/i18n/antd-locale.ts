import enUS from "antd/locale/en_US";
import msMY from "antd/locale/ms_MY";
import zhCN from "antd/locale/zh_CN";
import type { LocaleCode } from "@/locales";

export const antdLocaleByCode: Record<LocaleCode, typeof enUS> = {
  en: enUS,
  "zh-CN": zhCN,
  ms: msMY,
};
