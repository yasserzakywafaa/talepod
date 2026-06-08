import { Box, ButtonBase, Chip } from "@mui/material";
import {
  CheckRounded,
  MenuBookOutlined,
  SvgIconComponent,
  ViewCarouselOutlined,
} from "@mui/icons-material";

import { FC } from "react";
import characterKitten from "src/assets/images/landing_pages/dreamy_kitten.webp";
import characterLion from "src/assets/images/landing_pages/lion_cub.webp";
import characterOwl from "src/assets/images/landing_pages/wise_owl.webp";
import mascotSleepingBunny from "src/assets/images/sleeping_bunny_with_a_moon.webp";
import {
  borderStrongDark,
  borderStrongLight,
  gradCover,
  honey400,
  parchment200,
  surface2Dark,
} from "src/application/shared/themes";

export type StoryFormat = "comic" | "long";

export interface FormatChooserProps {
  value: StoryFormat;
  onChange: (value: StoryFormat) => void;
  variant?: "stacked" | "row";
}

interface FormatItem {
  id: StoryFormat;
  icon: SvgIconComponent;
  badge: string;
  title: string;
  sub: string;
  art: string[];
}

const ITEMS: FormatItem[] = [
  {
    id: "comic",
    icon: ViewCarouselOutlined,
    badge: "Picture story",
    title: "Comic book",
    sub: "~6 illustrated pages · best for younger kids",
    art: [mascotSleepingBunny, characterKitten, characterOwl],
  },
  {
    id: "long",
    icon: MenuBookOutlined,
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
    <Box
      sx={{
        display: "flex",
        flexDirection: stacked ? "column" : "row",
        gap: stacked ? "10px" : "14px",
      }}
    >
      {ITEMS.map((it) => {
        const sel = value === it.id;
        return (
          <ButtonBase
            key={it.id}
            onClick={() => onChange(it.id)}
            sx={{
              flex: 1,
              textAlign: "left",
              backgroundColor: "background.paper",
              borderRadius: "var(--r-lg)",
              padding: stacked ? "12px" : "14px",
              borderWidth: sel ? 1.5 : 1,
              borderStyle: "solid",
              borderColor: sel ? honey400 : "divider",
              boxShadow: sel
                ? "0 0 0 4px rgba(240,182,72,0.18), var(--shadow-sm)"
                : "var(--shadow-xs)",
              fontFamily: "inherit",
              color: "text.primary",
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              gap: "10px",
              position: "relative",
            }}
          >
            <FormatPreview kind={it.id} art={it.art} compact={stacked} />
            <Box
              sx={{ display: "flex", alignItems: "flex-start", gap: "10px" }}
            >
              <Box
                sx={(theme) => ({
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  background: sel
                    ? honey400
                    : theme.palette.mode === "light"
                      ? parchment200
                      : surface2Dark,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                })}
              >
                <it.icon
                  sx={{ fontSize: 20, color: sel ? "#fff" : "text.primary" }}
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Chip
                  variant="badge"
                  color={sel ? "primary" : "secondary"}
                  label={it.badge}
                />
                <Box
                  sx={{
                    fontFamily: "var(--font-display)",
                    fontSize: 18,
                    lineHeight: 1.15,
                    color: "text.primary",
                    marginTop: "4px",
                  }}
                >
                  {it.title}
                </Box>
                <Box
                  sx={{
                    fontSize: 11,
                    color: "text.secondary",
                    marginTop: "2px",
                    lineHeight: 1.4,
                  }}
                >
                  {it.sub}
                </Box>
              </Box>
              <Box
                sx={(theme) => ({
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  border: sel
                    ? "none"
                    : `1.5px solid ${
                        theme.palette.mode === "light"
                          ? borderStrongLight
                          : borderStrongDark
                      }`,
                  background: sel ? honey400 : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: "4px",
                })}
              >
                {sel && <CheckRounded sx={{ fontSize: 14, color: "#fff" }} />}
              </Box>
            </Box>
          </ButtonBase>
        );
      })}
    </Box>
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
      <Box
        sx={{
          height: H,
          borderRadius: "var(--r-md)",
          background: "linear-gradient(160deg, #22224F, #433578)",
          padding: "6px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "4px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box sx={{ position: "absolute", inset: 0, backgroundImage: stars }} />
        {art.map((a, i) => (
          <Box
            key={i}
            sx={{
              position: "relative",
              background:
                "linear-gradient(160deg, rgba(255,230,168,0.85), rgba(201,182,232,0.85))",
              borderRadius: "6px",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <Box
              component="img"
              src={a}
              alt=""
              sx={{ width: "85%", marginBottom: "-1px" }}
            />
          </Box>
        ))}
        <Box
          sx={{
            position: "absolute",
            top: "6px",
            right: "6px",
            background: "rgba(0,0,0,0.55)",
            color: "#fff",
            fontSize: 9,
            fontWeight: 600,
            padding: "2px 6px",
            borderRadius: "999px",
            letterSpacing: "0.04em",
          }}
        >
          6 pages
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: H,
        borderRadius: "var(--r-md)",
        background: "linear-gradient(160deg, #22224F, #742F25)",
        padding: "8px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box sx={{ position: "absolute", inset: 0, backgroundImage: stars }} />
      <Box
        sx={{
          position: "relative",
          width: 60,
          height: H - 16,
          borderRadius: "6px",
          background: gradCover,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          flexShrink: 0,
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <Box
          component="img"
          src={art[0]}
          alt=""
          sx={{ width: "90%", marginBottom: "-2px" }}
        />
      </Box>
      <Box sx={{ position: "relative", flex: 1, minWidth: 0 }}>
        {[80, 100, 100, 70, 100, 60].map((w, i) => (
          <Box
            key={i}
            sx={{
              height: i === 0 ? 7 : 5,
              background:
                i === 0 ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.32)",
              borderRadius: "3px",
              marginBottom: "4px",
              width: `${w}%`,
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default FormatChooser;
