import {
  AutoAwesomeOutlined,
  DoneAllOutlined,
  EditOutlined,
  ImageOutlined,
  PaletteOutlined,
  SvgIconComponent,
} from "@mui/icons-material";
import { FC, useEffect, useState } from "react";

import { Chip } from "@mui/material";
import { StoryFormat } from "../store/state";
import bunny from "src/assets/images/sleeping_bunny_with_a_moon.webp";
import { bgTwilight, glowHoney, honey300, honey400 } from "src/application/shared/themes";

/**
 * Immersive, format-aware "generating" overlay shown while a story is being
 * created. Twilight gradient + sleeping-bunny mascot + a 4-stage progress rail
 * (Idea → Write → Paint → Done). Renders as a fixed full-viewport layer.
 */
export interface GeneratingScreenProps {
  format: StoryFormat;
  childName?: string;
}

const STAGES: Record<
  StoryFormat,
  { label: string; sub: string; icon: SvgIconComponent; rail: string }[]
> = {
  comic: [
    {
      label: "Imagining…",
      sub: "Picking the scenes for tonight",
      icon: AutoAwesomeOutlined,
      rail: "Idea",
    },
    {
      label: "Writing captions…",
      sub: "Short, comic-panel lines",
      icon: EditOutlined,
      rail: "Write",
    },
    {
      label: "Painting the scenes…",
      sub: "Each page gets its own watercolor",
      icon: PaletteOutlined,
      rail: "Paint",
    },
    {
      label: "Almost ready…",
      sub: "Bundling the comic",
      icon: DoneAllOutlined,
      rail: "Done",
    },
  ],
  long: [
    {
      label: "Imagining…",
      sub: "Setting the scene",
      icon: AutoAwesomeOutlined,
      rail: "Idea",
    },
    {
      label: "Writing your story…",
      sub: "Warm, rich bedtime prose",
      icon: EditOutlined,
      rail: "Write",
    },
    {
      label: "Painting the cover…",
      sub: "One soft watercolor cover",
      icon: ImageOutlined,
      rail: "Cover",
    },
    {
      label: "Almost ready…",
      sub: "Tucking it into the library",
      icon: DoneAllOutlined,
      rail: "Done",
    },
  ],
};

const GeneratingScreen: FC<GeneratingScreenProps> = ({ format, childName }) => {
  const stages = STAGES[format];
  // Advance through the stages on a timer, holding on the "Paint" step until
  // the real request resolves (this overlay unmounts when fetching ends).
  const [active, setActive] = useState(0);

  useEffect(() => {
    const holdAt = stages.length - 2; // hold on "Paint/Cover"
    const id = setInterval(() => {
      setActive((a) => (a >= holdAt ? holdAt : a + 1));
    }, 3200);
    return () => clearInterval(id);
  }, [stages.length]);

  const honey = honey400;
  const stage = stages[active];

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 13000,
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 28px",
        textAlign: "center",
        fontFamily: "var(--font-body)",
        background: bgTwilight,
        animation: "tp-fade-in var(--dur-3) var(--ease-out)",
      }}
    >
      {/* star field */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "radial-gradient(circle at 10% 15%, rgba(255,213,107,0.55) 0 1.5px, transparent 2px), radial-gradient(circle at 85% 22%, rgba(255,255,255,0.6) 0 1.2px, transparent 1.5px), radial-gradient(circle at 70% 60%, rgba(255,213,107,0.5) 0 1px, transparent 1.5px), radial-gradient(circle at 30% 80%, rgba(255,255,255,0.4) 0 0.8px, transparent 1.5px)",
        }}
      />

      <img
        src={bunny}
        alt={`story is being generated for ${childName ?? "the child"}`}
        title={`story is being generated for ${childName ?? "the child"}`}
        style={{
          width: 184,
          height: 184,
          margin: 0,
          position: "relative",
          filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.4))",
          animation: "tp-breathe 3.2s var(--ease-soft) infinite",
        }}
      />

      <div style={{ position: "relative" }}>
        <Chip
          variant="badge"
          color={format === "comic" ? "primary" : "secondary"}
          label={format === "comic" ? "Comic · ~6 pages" : "Long story"}
        />
      </div>

      {childName && (
        <div
          style={{
            fontFamily: "var(--font-accent)",
            fontSize: 22,
            color: honey300,
            marginTop: 10,
            position: "relative",
          }}
        >
          For {childName}
        </div>
      )}

      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 28,
          lineHeight: 1.15,
          margin: "4px 0 0",
          position: "relative",
        }}
      >
        {stage.label}
      </h1>
      <p
        style={{
          marginTop: 4,
          fontSize: 13,
          opacity: 0.78,
          maxWidth: 280,
          position: "relative",
        }}
      >
        {stage.sub}
      </p>

      <div
        style={{
          display: "flex",
          gap: 22,
          marginTop: 32,
          position: "relative",
        }}
      >
        {stages.map((s, i) => (
          <div
            key={s.rail}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 13,
                background: i <= active ? honey : "rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: i === active ? glowHoney : "none",
                transition: "background var(--dur-3) var(--ease-out)",
              }}
            >
              <s.icon
                sx={{
                  fontSize: 20,
                  color: i <= active ? "#1a1224" : "rgba(255,255,255,0.6)",
                }}
              />
            </div>
            <div
              style={{
                fontSize: 10,
                opacity: i <= active ? 1 : 0.45,
                fontWeight: 600,
              }}
            >
              {s.rail}
            </div>
          </div>
        ))}
      </div>

      <p
        style={{ position: "absolute", bottom: 32, fontSize: 11, opacity: 0.6 }}
      >
        {format === "comic"
          ? "Usually 40–60 seconds."
          : "Usually 25–45 seconds."}
      </p>

      <style>{`
        @keyframes tp-fade-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes tp-breathe { 0%,100% { transform: translateY(0) scale(1) } 50% { transform: translateY(-6px) scale(1.02) } }
      `}</style>
    </div>
  );
};

export default GeneratingScreen;
