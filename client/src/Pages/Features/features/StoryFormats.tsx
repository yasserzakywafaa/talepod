import { Badge, Btn, Icon } from "src/components/shared/v2";

import { Box } from "@mui/material";
import characterKitten from "src/assets/images/v2/character_kitten.webp";
import characterLion from "src/assets/images/v2/character_lion.webp";
import characterOwl from "src/assets/images/v2/character_owl.webp";
import mascotSleepingBunny from "src/assets/images/v2/mascot_sleeping_bunny.webp";
import routes from "src/application/routes";
import { useNavigate } from "react-router-dom";

/* The flagship V2 product change: two story formats (Comic + Long).
   Faithful port of the design bundle's `MFormats` section, rebuilt with the
   shared v2 components + CSS tokens so it adapts to dark/light automatically. */

const PREVIEW_SKY =
  "linear-gradient(170deg, oklch(0.30 0.10 280), oklch(0.45 0.12 30))";

const COMIC_STARFIELD =
  "radial-gradient(circle at 20% 25%, rgba(255,213,107,0.55) 0 2px, transparent 3px)," +
  "radial-gradient(circle at 80% 30%, rgba(255,255,255,0.5) 0 1.5px, transparent 2.5px)," +
  "radial-gradient(circle at 60% 75%, rgba(255,213,107,0.5) 0 1.5px, transparent 2.5px)";

const LONG_STARFIELD =
  "radial-gradient(circle at 25% 30%, rgba(255,213,107,0.5) 0 1.8px, transparent 2.5px)," +
  "radial-gradient(circle at 75% 70%, rgba(255,255,255,0.45) 0 1.5px, transparent 2.5px)";

const COMIC_PAGES = [mascotSleepingBunny, characterKitten, characterOwl];

const overlineStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--honey-600)",
};

interface FormatPanelProps {
  tone: "honey" | "twilight";
  badge: string;
  title: string;
  desc: string;
  features: string[];
  previewKind: "comic" | "long";
  onTry: () => void;
}

const FormatPanel: React.FC<FormatPanelProps> = ({
  tone,
  badge,
  title,
  desc,
  features,
  previewKind,
  onTry,
}) => {
  const isHoney = tone === "honey";

  return (
    <Box
      sx={{
        background: "var(--surface)",
        borderRadius: "var(--r-xl)",
        p: "26px",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-md)",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
      }}
    >
      {/* Preview */}
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
              6 pages
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
                background: "linear-gradient(160deg, #FFE6A8, #C9B6E8)",
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

      {/* Copy */}
      <div>
        <Badge tone={isHoney ? "honey" : "twilight"}>{badge}</Badge>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 32,
            lineHeight: 1.1,
            margin: "10px 0 8px",
            color: "var(--fg)",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.55,
            color: "var(--fg-2)",
            margin: 0,
          }}
        >
          {desc}
        </p>
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
          <li
            key={f}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              fontSize: 13,
              color: "var(--fg-2)",
            }}
          >
            <Icon
              name="check_circle"
              size={16}
              color={isHoney ? "var(--honey-500)" : "var(--twilight-500)"}
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div>
        <Btn
          variant={isHoney ? "primary" : "secondary"}
          size="md"
          icon="auto_fix_high"
          onClick={onTry}
        >
          Try {title.toLowerCase()}
        </Btn>
      </div>
    </Box>
  );
};

const StoryFormats: React.FC = () => {
  const navigate = useNavigate();
  const goCreate = () => navigate(routes.create);

  return (
    <Box component="section" sx={{ width: "100%" }}>
      <Box sx={{ textAlign: "center", mb: 5 }}>
        <div style={overlineStyle}>Two story formats</div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 5vw, 42px)",
            lineHeight: 1.1,
            margin: "8px 0 6px",
            color: "var(--fg)",
          }}
        >
          Bedtime, told two ways.
        </h2>
        <p
          style={{
            fontSize: 15,
            color: "var(--fg-2)",
            margin: "6px auto 0",
            maxWidth: 560,
            lineHeight: 1.5,
          }}
        >
          Pick a comic book of six painted pages for younger kids, or a long,
          vivid chapter story for the readers who never want bedtime to end.
        </p>
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
          badge="New · Picture story"
          title="Comic book"
          desc="Six full-page painted scenes with short captions and the occasional speech bubble. Swipe through them like a picture book — perfect for ages 3–7."
          features={[
            "~6 illustrated pages, one scene each",
            "Tap or swipe to turn the page",
            "Classic or speech-bubble panels",
            "5–7 minutes of bedtime",
          ]}
          previewKind="comic"
          onTry={goCreate}
        />
        <FormatPanel
          tone="twilight"
          badge="Chapter book"
          title="Long story"
          desc="A cover illustration and rich, vivid prose underneath. For readers who want to curl up and disappear into a longer story."
          features={[
            "One painted cover, no mid-story art",
            "7, 12 or 18-minute reading lengths",
            "Add narration whenever you want",
            "Save and resume across devices",
          ]}
          previewKind="long"
          onTry={goCreate}
        />
      </Box>
    </Box>
  );
};

export default StoryFormats;
