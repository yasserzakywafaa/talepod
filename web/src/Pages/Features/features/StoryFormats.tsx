import { AutoFixHighOutlined, CheckCircleOutlined } from "@mui/icons-material";
import { Box, Button, Chip } from "@mui/material";

import characterKitten from "src/assets/images/landing_pages/dreamy_kitten.webp";
import characterLion from "src/assets/images/landing_pages/lion_cub.webp";
import characterOwl from "src/assets/images/landing_pages/wise_owl.webp";
import mascotSleepingBunny from "src/assets/images/sleeping_bunny_with_a_moon.webp";
import { routes } from "src/application/routes";
import { useLocalizedPath } from "@yasserzakywafaa/client-core/web/i18n";
import { useNavigate } from "react-router-dom";
import {
  gradCover,
  gradScene,
  honey500,
  honey600,
  twilight500,
} from "src/application/shared/themes";
import { useTranslation } from "react-i18next";

const PREVIEW_SKY = gradScene;

const COMIC_STARFIELD =
  "radial-gradient(circle at 20% 25%, rgba(255,213,107,0.55) 0 2px, transparent 3px)," +
  "radial-gradient(circle at 80% 30%, rgba(255,255,255,0.5) 0 1.5px, transparent 2.5px)," +
  "radial-gradient(circle at 60% 75%, rgba(255,213,107,0.5) 0 1.5px, transparent 2.5px)";

const LONG_STARFIELD =
  "radial-gradient(circle at 25% 30%, rgba(255,213,107,0.5) 0 1.8px, transparent 2.5px)," +
  "radial-gradient(circle at 75% 70%, rgba(255,255,255,0.45) 0 1.5px, transparent 2.5px)";

const COMIC_PAGES = [mascotSleepingBunny, characterKitten, characterOwl];

interface FormatPanelProps {
  tone: "honey" | "twilight";
  badge: string;
  title: string;
  desc: string;
  features: string[];
  tryCta: string;
  previewKind: "comic" | "long";
  comicPagesLabel: string;
  onTry: () => void;
}

const FormatPanel: React.FC<FormatPanelProps> = ({
  tone,
  badge,
  title,
  desc,
  features,
  tryCta,
  previewKind,
  comicPagesLabel,
  onTry,
}) => {
  const isHoney = tone === "honey";

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        borderRadius: "var(--r-xl)",
        p: "26px",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "var(--shadow-md)",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
      }}
    >
      <div style={{ borderRadius: "var(--r-lg)", overflow: "hidden" }}>
        {previewKind === "comic" ? (
          <div
            style={{
              height: 220,
              background: PREVIEW_SKY,
              padding: 14,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 8,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: COMIC_STARFIELD,
              }}
            />
            {COMIC_PAGES.map((src, i) => (
              <div
                key={i}
                style={{
                  position: "relative",
                  borderRadius: 10,
                  background:
                    "linear-gradient(160deg, rgba(255,230,168,0.9), rgba(201,182,232,0.9))",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.25)",
                }}
              >
                <img
                  src={src}
                  alt=""
                  style={{ width: "82%", marginBottom: -2 }}
                />
              </div>
            ))}
            <div
              style={{
                position: "absolute",
                top: 12,
                right: 14,
                background: "rgba(0,0,0,0.55)",
                color: "#fff",
                fontSize: 11,
                fontWeight: 600,
                padding: "4px 10px",
                borderRadius: 999,
              }}
            >
              {comicPagesLabel}
            </div>
          </div>
        ) : (
          <div
            style={{
              height: 220,
              background: PREVIEW_SKY,
              padding: 18,
              display: "flex",
              alignItems: "center",
              gap: 18,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: LONG_STARFIELD,
              }}
            />
            <div
              style={{
                position: "relative",
                width: 130,
                height: "100%",
                borderRadius: 12,
                background: gradCover,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                flexShrink: 0,
                border: "1px solid rgba(255,255,255,0.25)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <img
                src={characterLion}
                alt=""
                style={{ width: "82%", marginBottom: -2 }}
              />
            </div>
            <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
              {[90, 100, 100, 75, 100, 100, 65].map((w, i) => (
                <div
                  key={i}
                  style={{
                    height: i === 0 ? 12 : 7,
                    background:
                      i === 0
                        ? "rgba(255,255,255,0.85)"
                        : "rgba(255,255,255,0.4)",
                    borderRadius: 4,
                    marginBottom: 6,
                    width: `${w}%`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <Chip
          variant="badge"
          color={isHoney ? "primary" : "secondary"}
          label={badge}
        />
        <Box
          component="h3"
          sx={{
            fontFamily: "var(--font-display)",
            fontSize: 32,
            lineHeight: 1.1,
            margin: "10px 0 8px",
            color: "text.primary",
          }}
        >
          {title}
        </Box>
        <Box
          component="p"
          sx={{
            fontSize: 14,
            lineHeight: 1.55,
            color: "text.secondary",
            margin: 0,
          }}
        >
          {desc}
        </Box>
      </div>

      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {features.map((f) => (
          <Box
            component="li"
            key={f}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
              fontSize: 13,
              color: "text.secondary",
            }}
          >
            <CheckCircleOutlined
              sx={{
                fontSize: 16,
                color: isHoney ? honey500 : twilight500,
              }}
            />
            <span>{f}</span>
          </Box>
        ))}
      </ul>

      <div>
        <Button
          variant={isHoney ? "contained" : "outlined"}
          startIcon={<AutoFixHighOutlined />}
          onClick={onTry}
        >
          {tryCta}
        </Button>
      </div>
    </Box>
  );
};

const StoryFormats: React.FC = () => {
  const { t } = useTranslation("landing");
  const navigate = useNavigate();
  const localizedPath = useLocalizedPath();
  const goCreate = (style: "comic" | "long") =>
    navigate(`${localizedPath(routes.create)}?style=${style}`);

  const comicFeatures = t("features.storyFormats.comic.features", {
    returnObjects: true,
  }) as string[];
  const longFeatures = t("features.storyFormats.long.features", {
    returnObjects: true,
  }) as string[];

  return (
    <Box component="section" sx={{ width: "100%" }}>
      <Box sx={{ textAlign: "center", mb: 5 }}>
        <Box
          component="div"
          sx={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: honey600,
          }}
        >
          {t("features.storyFormats.overline")}
        </Box>
        <Box
          component="h2"
          sx={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 5vw, 42px)",
            lineHeight: 1.1,
            margin: "8px 0 6px",
            color: "text.primary",
          }}
        >
          {t("features.storyFormats.title")}
        </Box>
        <Box
          component="p"
          sx={{
            fontSize: 15,
            color: "text.secondary",
            margin: "6px auto 0",
            maxWidth: 560,
            lineHeight: 1.5,
          }}
        >
          {t("features.storyFormats.subtitle")}
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2.5,
        }}
      >
        <FormatPanel
          tone="honey"
          badge={t("features.storyFormats.comic.badge")}
          title={t("features.storyFormats.comic.title")}
          desc={t("features.storyFormats.comic.description")}
          features={comicFeatures}
          tryCta={t("features.storyFormats.comic.tryCta")}
          previewKind="comic"
          comicPagesLabel={t("features.storyFormats.comicPages")}
          onTry={() => goCreate("comic")}
        />
        <FormatPanel
          tone="twilight"
          badge={t("features.storyFormats.long.badge")}
          title={t("features.storyFormats.long.title")}
          desc={t("features.storyFormats.long.description")}
          features={longFeatures}
          tryCta={t("features.storyFormats.long.tryCta")}
          previewKind="long"
          comicPagesLabel={t("features.storyFormats.comicPages")}
          onTry={() => goCreate("long")}
        />
      </Box>
    </Box>
  );
};

export default StoryFormats;
