"use client";

import {
  CloudUploadOutlined,
  DownloadOutlined,
  GithubOutlined,
  GlobalOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  App,
  Alert,
  Button,
  Card,
  Col,
  ConfigProvider,
  Empty,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useCallback, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { DemoVideo } from "@/components/demo-video";
import { antdLocaleByCode } from "@/i18n/antd-locale";
import { useI18n } from "@/i18n/i18n-context";
import type { LocaleCode } from "@/locales";
import {
  buildResultsWorkbook,
  downloadArrayBuffer,
} from "@/lib/export-excel";
import {
  buildPlayerIndexes,
  displayNameForPlayer,
  lookupPlayer,
} from "@/lib/match-players";
import type { Player } from "@/types/player";

const { Title, Paragraph, Text } = Typography;

type FormValues = { namesText: string };

export type ResultRow = {
  key: string;
  input: string;
  name: string;
  rating: string;
  state: string;
  matched: boolean;
};

function parseNames(text: string): string[] {
  const lines = text
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const line of lines) {
    const k = line.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(line);
  }
  return out;
}

function buildResultRows(
  names: string[],
  players: Player[],
  dash: string,
): ResultRow[] {
  const indexes = buildPlayerIndexes(players);
  return names.map((input, i) => {
    const p = lookupPlayer(input, indexes);
    if (p) {
      return {
        key: `${i}-${input}`,
        input,
        name: displayNameForPlayer(p),
        rating: p.rating,
        state: p.state,
        matched: true,
      };
    }
    return {
      key: `${i}-${input}`,
      input,
      name: input,
      rating: dash,
      state: dash,
      matched: false,
    };
  });
}

function averageNumericRating(rows: ResultRow[]): number | null {
  const nums = rows
    .filter((r) => r.matched)
    .map((r) => Number.parseFloat(r.rating))
    .filter((n) => !Number.isNaN(n));
  if (nums.length === 0) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

async function fetchPlayers(): Promise<Player[]> {
  const res = await fetch("/api/players");
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }
  return res.json() as Promise<Player[]>;
}

export function NameListTool() {
  const { message } = App.useApp();
  const { locale, setLocale, t } = useI18n();

  const columns: ColumnsType<ResultRow> = useMemo(
    () => [
      {
        title: t("table.name"),
        dataIndex: "name",
        key: "name",
        ellipsis: true,
      },
      {
        title: t("table.rating"),
        dataIndex: "rating",
        key: "rating",
        width: 96,
        align: "center",
      },
      {
        title: t("table.state"),
        dataIndex: "state",
        key: "state",
        width: 120,
        ellipsis: true,
      },
    ],
    [t],
  );
  const [rows, setRows] = useState<ResultRow[] | null>(null);

  const {
    data: players,
    isLoading: registryLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["players"],
    queryFn: fetchPlayers,
    staleTime: 5 * 60 * 1000,
  });

  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: { namesText: "" },
  });

  const namesText = watch("namesText");
  const lineCount = useMemo(() => parseNames(namesText || "").length, [namesText]);

  const avgRating = useMemo(
    () => (rows?.length ? averageNumericRating(rows) : null),
    [rows],
  );

  const matchedCount = useMemo(
    () => rows?.filter((r) => r.matched).length ?? 0,
    [rows],
  );

  const onSubmit = useCallback(
    (data: FormValues) => {
      const names = parseNames(data.namesText);
      if (names.length === 0) {
        message.warning(t("toast.noNames"));
        return;
      }
      if (!players?.length) {
        message.error(t("toast.registryNotReady"));
        return;
      }
      setRows(buildResultRows(names, players, t("results.dash")));
      message.success(t("toast.lookupDone"));
    },
    [message, players, t],
  );

  const onExport = useCallback(async () => {
    if (!rows?.length) return;
    try {
      const exportRows = rows.map((r) => ({
        name: r.name,
        rating: r.matched ? r.rating : "",
        state: r.matched ? r.state : "",
      }));
      const buffer = await buildResultsWorkbook(exportRows, {
        sheetName: t("excel.sheetName"),
        headers: {
          name: t("excel.name"),
          rating: t("excel.rating"),
          state: t("excel.state"),
        },
      });
      downloadArrayBuffer(
        buffer,
        `${t("excel.filePrefix")}-${new Date().toISOString().slice(0, 10)}.xlsx`,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      message.success(t("toast.downloadStarted"));
    } catch {
      message.error(t("toast.exportFailed"));
    }
  }, [rows, message, t]);

  return (
    <ConfigProvider
      locale={antdLocaleByCode[locale]}
      theme={{
        token: {
          colorPrimary: "#0f766e",
          borderRadiusLG: 16,
          fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
        },
        components: {
          Card: {
            headerFontSize: 16,
            paddingLG: 22,
          },
          Statistic: {
            titleFontSize: 12,
          },
        },
      }}
    >
      <div className="name-tool-page flex min-h-dvh flex-col">
        <header className="shrink-0 border-b border-zinc-200/70 bg-white/85 px-4 py-4 shadow-[0_1px_0_rgb(0_0_0_/0.03)] backdrop-blur-md sm:px-6 sm:py-5">
          <div className="mx-auto flex max-w-3xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Space align="center" size={12}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 text-lg text-white shadow-md shadow-teal-700/25 ring-1 ring-white/20">
                <UnorderedListOutlined />
              </span>
              <div className="min-w-0">
                <Title
                  level={4}
                  className="!mb-0.5 !text-lg tracking-tight text-zinc-900 sm:!text-xl"
                >
                  {t("header.title")}
                </Title>
                <Text type="secondary" className="block text-xs leading-snug sm:text-sm">
                  {t("header.subtitle")}
                </Text>
              </div>
            </Space>
            <div className="flex flex-wrap items-center gap-2 rounded-full border border-zinc-200/80 bg-zinc-50/90 px-2.5 py-1.5 sm:justify-end">
              <GlobalOutlined
                className="ml-0.5 text-base text-teal-600/70"
                aria-hidden
              />
              <Select<LocaleCode>
                size="small"
                value={locale}
                onChange={setLocale}
                variant="borderless"
                options={[
                  { value: "en", label: t("lang.en") },
                  { value: "zh-CN", label: t("lang.zhCN") },
                  { value: "ms", label: t("lang.ms") },
                ]}
                className="min-w-[132px] !text-sm"
                aria-label={t("lang.label")}
              />
            </div>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-7 sm:gap-7 sm:px-6 sm:py-12">
          {isError && (
            <Alert
              type="error"
              showIcon
              message={t("errors.registryLoad")}
              description={
                error instanceof Error ? error.message : t("errors.unknownError")
              }
              action={
                <Button size="small" onClick={() => void refetch()}>
                  {t("alert.retry")}
                </Button>
              }
            />
          )}

          <Card
            className="surface-card !rounded-2xl"
            styles={{ body: { padding: "22px 18px" } }}
          >
            <Space orientation="vertical" size="middle" className="w-full">
              <div>
                <Title level={5} className="!mb-1 !text-base">
                  {t("list.stepTitle")}
                </Title>
                <Paragraph type="secondary" className="!mb-0 !text-sm">
                  {t("list.hintBefore")}
                  <Text code>{t("list.codeExample")}</Text>
                  {t("list.hintAfter")}
                </Paragraph>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <Controller
                  name="namesText"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={10}
                      autoComplete="off"
                      spellCheck={false}
                      placeholder={t("list.placeholder")}
                      className="w-full min-h-[200px] resize-y rounded-xl border border-zinc-200/90 bg-white px-3.5 py-3.5 text-[15px] leading-relaxed text-zinc-900 shadow-inner shadow-zinc-900/[0.02] outline-none transition-[border,box-shadow] placeholder:text-zinc-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 sm:min-h-[240px]"
                    />
                  )}
                />

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Text type="secondary" className="text-xs sm:text-sm">
                    {registryLoading
                      ? t("footer.loadingRegistry")
                      : lineCount === 0
                        ? t("footer.noNames")
                        : lineCount === 1
                          ? t("footer.uniqueOne")
                          : t("footer.uniqueMany", { count: lineCount })}
                    {players && !registryLoading
                      ? t("footer.registryCount", {
                          count: players.length.toLocaleString(),
                        })
                      : null}
                  </Text>
                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    loading={registryLoading}
                    disabled={isError}
                    icon={<CloudUploadOutlined />}
                    className="w-full sm:!w-auto sm:min-w-[200px]"
                  >
                    {t("actions.lookup")}
                  </Button>
                </div>
              </form>
            </Space>
          </Card>

          <Card
            className="surface-card !rounded-2xl"
            title={
              <span className="text-base font-semibold text-zinc-900">
                {t("results.title")}
              </span>
            }
            styles={{
              header: { borderBottom: "1px solid rgb(228 231 229 / 0.9)" },
              body: { padding: "18px 14px" },
            }}
            extra={
              <Button
                type="default"
                icon={<DownloadOutlined />}
                disabled={!rows?.length}
                onClick={() => void onExport()}
                className="max-sm:!mt-2 max-sm:w-full sm:shrink-0"
              >
                {t("actions.exportExcel")}
              </Button>
            }
          >
            {!rows?.length && !registryLoading && (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span className="text-zinc-500">{t("results.empty")}</span>
                }
              />
            )}

            {rows && rows.length > 0 && (
              <Space orientation="vertical" size="middle" className="w-full">
                <Row gutter={[12, 12]}>
                  <Col xs={12} sm={8}>
                    <div className="stat-tile h-full">
                      <Statistic title={t("results.statRows")} value={rows.length} />
                    </div>
                  </Col>
                  <Col xs={12} sm={8}>
                    <div className="stat-tile h-full">
                      <Statistic
                        title={t("results.statMatched")}
                        value={matchedCount}
                      />
                    </div>
                  </Col>
                  <Col xs={24} sm={8}>
                    <div className="stat-tile h-full">
                      <Statistic
                        title={t("results.statAvgRating")}
                        value={
                          avgRating !== null
                            ? Math.round(avgRating * 10) / 10
                            : t("results.dash")
                        }
                      />
                    </div>
                  </Col>
                </Row>

                <div className="table-shell -mx-0.5 overflow-x-auto sm:mx-0">
                  <Table<ResultRow>
                    size="small"
                    columns={columns}
                    dataSource={rows}
                    pagination={{
                      pageSize: 8,
                      showSizeChanger: false,
                      responsive: true,
                    }}
                    scroll={{ x: 360 }}
                    className="min-w-[300px] [&_.ant-table]:bg-transparent"
                  />
                </div>
              </Space>
            )}
          </Card>
          <DemoVideo />
        </main>

        <footer className="mt-auto shrink-0 border-t border-zinc-200/70 bg-white/70 px-4 py-8 backdrop-blur-sm sm:px-6">
          <div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-2 text-center sm:flex-row sm:flex-wrap sm:gap-x-1 sm:gap-y-1 sm:text-left">
            <GithubOutlined
              className="text-lg text-zinc-400 sm:translate-y-px"
              aria-hidden
            />
            <p className="text-sm leading-relaxed text-zinc-500">
              <span>{t("siteFooter.prefix")}</span>
              <a
                href="https://github.com/ksliew0218"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-teal-700 underline decoration-teal-600/25 underline-offset-[3px] transition-colors hover:text-teal-800 hover:decoration-teal-600/45"
                title={t("siteFooter.githubTitle")}
              >
                {t("siteFooter.author")}
              </a>
              <span>{t("siteFooter.suffix")}</span>
            </p>
          </div>
        </footer>
      </div>
    </ConfigProvider>
  );
}
