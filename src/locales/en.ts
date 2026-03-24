export const en = {
  meta: {
    title: "Name list & ratings",
    description:
      "Paste a list of names, match ratings against the registry, export to Excel",
  },
  header: {
    title: "Name list & ratings",
    subtitle:
      "Paste names, match against the registry, export Name / Rating / State to Excel",
  },
  errors: {
    registryLoad: "Could not load player registry",
    unknownError: "Unknown error",
  },
  alert: {
    retry: "Retry",
  },
  list: {
    stepTitle: "1. Your list",
    hintBefore: "One name per line (Chinese or English), or an ID like ",
    hintAfter: ". Duplicates are ignored.",
    placeholder: "张钲鸿\nCHIN YOU HAO\nXQ785\n…",
    codeExample: "XQ785",
  },
  footer: {
    loadingRegistry: "Loading registry…",
    noNames: "No names yet",
    uniqueOne: "1 unique name",
    uniqueMany: "{{count}} unique names",
    registryCount: " · {{count}} players in registry",
  },
  siteFooter: {
    prefix: "Built by ",
    suffix: "",
    author: "ksliew0218",
    githubTitle: "ksliew0218 on GitHub",
  },
  actions: {
    lookup: "Look up ratings",
    exportExcel: "Export Excel",
  },
  toast: {
    noNames: "Add at least one name (one per line).",
    registryNotReady: "Player registry is not loaded yet.",
    lookupDone: "Lookup complete.",
    downloadStarted: "Download started.",
    exportFailed: "Could not build the Excel file.",
  },
  results: {
    title: "2. Results",
    empty:
      "Load the registry, then run a lookup to see Name, Rating, and State for each line.",
    statRows: "Rows",
    statMatched: "Matched",
    statAvgRating: "Avg. rating (numeric)",
    dash: "—",
  },
  table: {
    name: "Name",
    rating: "Rating",
    state: "State",
  },
  excel: {
    sheetName: "Results",
    name: "Name",
    rating: "Rating",
    state: "State",
    filePrefix: "name-list-ratings",
  },
  lang: {
    label: "Language",
    en: "English",
    zhCN: "简体中文",
    ms: "Bahasa Melayu",
  },
} as const;

type StringTree<T> = T extends string
  ? string
  : { [K in keyof T]: StringTree<T[K]> };

/** Same nested keys as `en`, string values (for locale modules). */
export type Messages = StringTree<typeof en>;
