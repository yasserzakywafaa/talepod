import { Badge } from "./DataDisplay";
import { FC } from "react";
import Icon from "./Icon";
import characterKitten from "src/assets/images/v2/character_kitten.webp";
import characterLion from "src/assets/images/v2/character_lion.webp";
import characterOwl from "src/assets/images/v2/character_owl.webp";
import mascotSleepingBunny from "src/assets/images/v2/mascot_sleeping_bunny.webp";

/** The two story formats a user can create in V2. */
export type StoryFormat = "comic" | "long";

export interface FormatChooserProps {
  value: StoryFormat;
  onChange: (value: StoryFormat) => void;
  /** "stacked" (mobile, vertical) | "row" (tablet/desktop, side-by-side) */
  variant?: "stacked" | "row";
}

interface FormatItem {
  id: StoryFormat;
  icon: string;
  badge: string;
  title: string;
  sub: string;
  art: string[];
}

const ITEMS: FormatItem[] = [
  {
    id: "comic",
    icon: "view_carousel",
    badge: "Picture story",
    title: "Comic book",
    sub: "~6 illustrated pages · best for younger kids",
    art: [mascotSleepingBunny, characterKitten, characterOwl],
  },
  {
    id: "long",
    icon: "menu_book",
    badge: "Chapter book",
    title: "Long story",
    sub: "Cover illustration · rich text · narration later",
    art: [characterLion],
  },
];

const FormatChooser: FC<FormatChooserProps> = ({
  value,
  onChange,
  variant = "row",
}) => {
  const stacked = variant === "stacked";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: stacked ? "column" : "row",
        gap: stacked ? 10 : 14,
      }}
    >
      {ITEMS.map((it) => {
        const sel = value === it.id;
        return (
          <button
            key={it.id}
            type="button"
            onClick={() => onChange(it.id)}
            style={{
              flex: 1,
              textAlign: "left",
              background: "var(--surface)",
              borderRadius: "var(--r-lg)",
              padding: stacked ? 12 : 14,
              border: sel
                ? "1.5px solid var(--honey-400)"
                : "1px solid var(--border)",
              boxShadow: sel
                ? "0 0 0 4px oklch(0.81 0.14 80 / 0.18), var(--shadow-sm)"
                : "var(--shadow-xs)",
              cursor: "pointer",
              fontFamily: "inherit",
              color: "var(--fg)",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              position: "relative",
            }}
          >
            <FormatPreview kind={it.id} art={it.art} compact={stacked} />
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: sel ? "var(--honey-400)" : "var(--surface-2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon
                  name={it.icon}
                  size={20}
                  color={sel ? "#fff" : "var(--fg)"}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Badge tone={sel ? "honey" : "twilight"}>{it.badge}</Badge>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 18,
                    lineHeight: 1.15,
                    color: "var(--fg)",
                    marginTop: 4,
                  }}
                >
                  {it.title}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--fg-2)",
                    marginTop: 2,
                    lineHeight: 1.4,
                  }}
                >
                  {it.sub}
                </div>
              </div>
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  border: sel ? "none" : "1.5px solid var(--border-strong)",
                  background: sel ? "var(--honey-400)" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 4,
                }}
              >
                {sel && <Icon name="check" size={14} color="#fff" />}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

interface FormatPreviewProps {
  kind: StoryFormat;
  art: string[];
  compact?: boolean;
}

const FormatPreview: FC<FormatPreviewProps> = ({ kind, art, compact }) => {
  const H = compact ? 84 : 110;
  const stars =
    "radial-gradient(circle at 18% 22%, rgba(255,213,107,0.45) 0 1.5px, transparent 2.5px), radial-gradient(circle at 78% 28%, rgba(255,255,255,0.45) 0 1.2px, transparent 2px)";

  if (kind === "comic") {
    return (
      <div
        style={{
          height: H,
          borderRadius: "var(--r-md)",
          background:
            "linear-gradient(160deg, oklch(0.28 0.08 280), oklch(0.38 0.11 290))",
          padding: 6,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 4,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{ position: "absolute", inset: 0, backgroundImage: stars }}
        />
        {art.map((a, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              background:
                "linear-gradient(160deg, rgba(255,230,168,0.85), rgba(201,182,232,0.85))",
              borderRadius: 6,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <img src={a} alt="" style={{ width: "85%", marginBottom: -1 }} />
          </div>
        ))}
        <div
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            background: "rgba(0,0,0,0.55)",
            color: "#fff",
            fontSize: 9,
            fontWeight: 600,
            padding: "2px 6px",
            borderRadius: 999,
            letterSpacing: "0.04em",
          }}
        >
          6 pages
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        height: H,
        borderRadius: "var(--r-md)",
        background:
          "linear-gradient(160deg, oklch(0.28 0.08 280), oklch(0.40 0.10 30))",
        padding: 8,
        display: "flex",
        alignItems: "center",
        gap: 10,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, backgroundImage: stars }} />
      <div
        style={{
          position: "relative",
          width: 60,
          height: H - 16,
          borderRadius: 6,
          background: "linear-gradient(160deg, #FFE6A8, #C9B6E8)",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          flexShrink: 0,
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <img src={art[0]} alt="" style={{ width: "90%", marginBottom: -2 }} />
      </div>
      <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
        {[80, 100, 100, 70, 100, 60].map((w, i) => (
          <div
            key={i}
            style={{
              height: i === 0 ? 7 : 5,
              background:
                i === 0 ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.32)",
              borderRadius: 3,
              marginBottom: 4,
              width: `${w}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FormatChooser;
