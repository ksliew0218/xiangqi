"use client";

import { PlayCircleOutlined } from "@ant-design/icons";
import { Card, Typography } from "antd";
import { useI18n } from "@/i18n/i18n-context";

const { Title, Paragraph } = Typography;

function withAutoplayParams(url: string): string {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    const isYouTubeEmbed =
      (host === "youtube.com" || host === "youtube-nocookie.com") &&
      parsed.pathname.startsWith("/embed/");

    if (!isYouTubeEmbed) return url;

    parsed.searchParams.set("autoplay", "1");
    parsed.searchParams.set("mute", "1");
    parsed.searchParams.set("playsinline", "1");
    parsed.searchParams.set("rel", "0");
    return parsed.toString();
  } catch {
    return url;
  }
}

function normalizeVideoUrl(raw: string | undefined): string | null {
  const value = raw?.trim();
  if (!value) return null;

  // Allow direct embed URLs and append autoplay params.
  if (value.includes("/embed/")) return withAutoplayParams(value);

  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtube.com" || host === "m.youtube.com") {
      // Handle Shorts URLs like /shorts/<id>
      const shortsMatch = url.pathname.match(/^\/shorts\/([^/?#]+)/);
      if (shortsMatch?.[1]) {
        return withAutoplayParams(
          `https://www.youtube.com/embed/${shortsMatch[1]}`,
        );
      }

      // Handle watch?v=<id>
      const watchId = url.searchParams.get("v");
      if (watchId) {
        return withAutoplayParams(`https://www.youtube.com/embed/${watchId}`);
      }
    }

    // Handle youtu.be/<id>
    if (host === "youtu.be") {
      const id = url.pathname.replace("/", "").trim();
      if (id) return withAutoplayParams(`https://www.youtube.com/embed/${id}`);
    }
  } catch {
    return null;
  }

  return null;
}

const DEMO_VIDEO_URL = "https://youtube.com/shorts/gHO5_M9b0Sg?feature=share";

const embedUrl = normalizeVideoUrl(DEMO_VIDEO_URL);

export function DemoVideo() {
  const { t } = useI18n();

  if (!embedUrl) return null;

  return (
    <Card
      className="surface-card !rounded-2xl overflow-hidden"
      styles={{ body: { padding: "20px 18px 22px" } }}
    >
      <div className="mb-3 flex items-start gap-2">
        <PlayCircleOutlined className="mt-0.5 text-lg text-teal-600" aria-hidden />
        <div className="min-w-0">
          <Title level={5} className="!mb-1 !text-base text-zinc-900">
            {t("demo.title")}
          </Title>
          <Paragraph type="secondary" className="!mb-0 !text-sm">
            {t("demo.description")}
          </Paragraph>
        </div>
      </div>
      <div className="relative w-full overflow-hidden rounded-xl border border-zinc-200/90 bg-zinc-900/5 pt-[56.25%] shadow-inner">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={embedUrl}
          title={t("demo.iframeTitle")}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </Card>
  );
}
