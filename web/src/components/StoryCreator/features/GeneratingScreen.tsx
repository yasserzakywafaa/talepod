import {
  AutoAwesomeOutlined,
  AutoFixHighOutlined,
  DoneAllOutlined,
  EditOutlined,
  SvgIconComponent,
} from "@mui/icons-material";
import { FC, useEffect, useMemo, useState } from "react";
import {
  bgTwilight,
  glowHoney,
  honey300,
  honey400,
} from "src/application/shared/themes";

import { Chip } from "@mui/material";
import { StoryFormat } from "../store/state";
import bunny from "src/assets/images/sleeping_bunny_with_a_moon.webp";
import { useTranslation } from "react-i18next";

/**
 * Immersive, format-aware "generating" overlay shown while a story is being
 * created. Twilight gradient + sleeping-bunny mascot + a 4-stage progress rail
 * (Idea → Write → Magic → Done). The rail mirrors the real *text* creation (no
 * misleading "Paint" step — images are generated later on the story page); it
 * holds on "Magic" until the request resolves, then `isComplete` advances it to
 * "Done". The page owns the short "Done" hold + navigation. Renders as a fixed
 * full-viewport layer.
 */
export interface GeneratingScreenProps {
  format: StoryFormat;
  childName?: string;
  /** Flip true once the story is actually created → show the "Done" step. */
  isComplete?: boolean;
}

const STAGE_ICONS: SvgIconComponent[] = [
  AutoAwesomeOutlined,
  EditOutlined,
  AutoFixHighOutlined,
  DoneAllOutlined,
];

const STAGE_KEYS = ["imagine", "write", "magic", "done"] as const;

const GeneratingScreen: FC<GeneratingScreenProps> = ({
  format,
  childName,
  isComplete,
}) => {
  const { t } = useTranslation("story");
  const stages = useMemo(
    () =>
      STAGE_KEYS.map((key, index) => ({
        label: t(`generating.stages.${format}.${key}.label`),
        sub: t(`generating.stages.${format}.${key}.sub`),
        icon: STAGE_ICONS[index],
        rail: t(`generating.stages.${format}.${key}.rail`),
      })),
    [format, t],
  );
  const [active, setActive] = useState(0);

  // While the request is in flight, advance Idea → Write → Magic and hold on
  // "Magic" (second-to-last) — the text is all that's being generated here.
  useEffect(() => {
    if (isComplete) return;
    const holdAt = stages.length - 2; // hold on "Magic"
    const id = setInterval(() => {
      setActive((a) => (a >= holdAt ? holdAt : a + 1));
    }, 3000);
    return () => clearInterval(id);
  }, [stages.length, isComplete]);

  // Once the story is actually created, jump straight to "Done". The page keeps
  // this overlay mounted for a short beat, then navigates — so navigation can't
  // be cancelled by anything unmounting this component.
  useEffect(() => {
    if (isComplete) setActive(stages.length - 1);
  }, [isComplete, stages.length]);

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
        alt={
          childName
            ? t("generating.imageAlt", { name: childName })
            : t("generating.imageAltDefault")
        }
        title={
          childName
            ? t("generating.imageAlt", { name: childName })
            : t("generating.imageAltDefault")
        }
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
          label={
            format === "comic"
              ? t("generating.formatChip.comic")
              : t("generating.formatChip.long")
          }
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
          {t("generating.forName", { name: childName })}
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
          ? t("generating.duration.comic")
          : t("generating.duration.long")}
      </p>

      <style>{`
        @keyframes tp-fade-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes tp-breathe { 0%,100% { transform: translateY(0) scale(1) } 50% { transform: translateY(-6px) scale(1.02) } }
      `}</style>
    </div>
  );
};

export default GeneratingScreen;
