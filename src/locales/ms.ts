import type { Messages } from "./en";

export const ms = {
  meta: {
    title: "Senarai nama & rating",
    description:
      "Tampal senarai nama, padankan dengan daftar pemain, eksport ke Excel",
  },
  header: {
    title: "Senarai nama & rating",
    subtitle:
      "Tampal nama, padan dengan daftar rasmi, eksport Nama / Rating / Negeri ke Excel",
  },
  errors: {
    registryLoad: "Tidak dapat memuatkan daftar pemain",
    unknownError: "Ralat tidak diketahui",
  },
  alert: {
    retry: "Cuba lagi",
  },
  list: {
    stepTitle: "1. Senarai anda",
    hintBefore: "Satu nama setiap baris (Cina atau Inggeris), atau ID seperti ",
    hintAfter: ". Nama berulang akan diabaikan.",
    placeholder: "张钲鸿\nCHIN YOU HAO\nXQ785\n…",
    codeExample: "XQ785",
  },
  footer: {
    loadingRegistry: "Memuatkan daftar…",
    noNames: "Belum ada nama",
    uniqueOne: "1 nama unik",
    uniqueMany: "{{count}} nama unik",
    registryCount: " · {{count}} pemain dalam daftar",
  },
  siteFooter: {
    prefix: "Dibina oleh ",
    suffix: "",
    author: "ksliew0218",
    githubTitle: "ksliew0218 di GitHub",
  },
  actions: {
    lookup: "Cari rating",
    exportExcel: "Eksport Excel",
  },
  toast: {
    noNames: "Tambah sekurang-kurangnya satu nama (satu setiap baris).",
    registryNotReady: "Daftar pemain belum siap dimuatkan.",
    lookupDone: "Carian selesai.",
    downloadStarted: "Muat turun dimulakan.",
    exportFailed: "Tidak dapat menjana fail Excel.",
  },
  results: {
    title: "2. Keputusan",
    empty:
      "Muatkan daftar, kemudian jalankan carian untuk melihat Nama, Rating dan Negeri bagi setiap baris.",
    statRows: "Baris",
    statMatched: "Padanan",
    statAvgRating: "Purata rating (angka)",
    dash: "—",
  },
  table: {
    name: "Nama",
    rating: "Rating",
    state: "Negeri",
  },
  excel: {
    sheetName: "Keputusan",
    name: "Nama",
    rating: "Rating",
    state: "Negeri",
    filePrefix: "senarai-rating",
  },
  lang: {
    label: "Bahasa",
    en: "English",
    zhCN: "简体中文",
    ms: "Bahasa Melayu",
  },
  demo: {
    title: "Demo",
    description:
      "Panduan ringkas: tampal nama, cari rating, eksport ke Excel.",
    iframeTitle: "Video demo aplikasi",
  },
} satisfies Messages;
