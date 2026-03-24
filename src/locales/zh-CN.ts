import type { Messages } from "./en";

export const zhCN = {
  meta: {
    title: "名单与等级分",
    description: "粘贴姓名列表，与注册库匹配等级分，导出为 Excel",
  },
  header: {
    title: "名单与等级分",
    subtitle:
      "粘贴姓名，与棋手注册库匹配，将姓名 / 等级分 / 州属导出到 Excel",
  },
  errors: {
    registryLoad: "无法加载棋手注册库",
    unknownError: "未知错误",
  },
  alert: {
    retry: "重试",
  },
  list: {
    stepTitle: "1. 您的名单",
    hintBefore: "每行一个姓名（中文或英文），或棋手编号如 ",
    hintAfter: "。重复行会被忽略。",
    placeholder: "张钲鸿\nCHIN YOU HAO\nXQ785\n…",
    codeExample: "XQ785",
  },
  footer: {
    loadingRegistry: "正在加载注册库…",
    noNames: "尚未输入姓名",
    uniqueOne: "1 个不重复姓名",
    uniqueMany: "{{count}} 个不重复姓名",
    registryCount: " · 注册库共 {{count}} 人",
  },
  siteFooter: {
    prefix: "由 ",
    suffix: " 构建",
    author: "ksliew0218",
    githubTitle: "ksliew0218 的 GitHub",
  },
  actions: {
    lookup: "查询等级分",
    exportExcel: "导出 Excel",
  },
  toast: {
    noNames: "请至少输入一个姓名（每行一个）。",
    registryNotReady: "棋手注册库尚未加载完成。",
    lookupDone: "查询完成。",
    downloadStarted: "已开始下载。",
    exportFailed: "无法生成 Excel 文件。",
  },
  results: {
    title: "2. 结果",
    empty: "加载注册库后点击查询，即可查看每行对应的姓名、等级分与州属。",
    statRows: "行数",
    statMatched: "已匹配",
    statAvgRating: "平均等级分（数值）",
    dash: "—",
  },
  table: {
    name: "姓名",
    rating: "等级分",
    state: "州属",
  },
  excel: {
    sheetName: "结果",
    name: "姓名",
    rating: "等级分",
    state: "州属",
    filePrefix: "名单等级分",
  },
  lang: {
    label: "语言",
    en: "English",
    zhCN: "简体中文",
    ms: "Bahasa Melayu",
  },
} satisfies Messages;
