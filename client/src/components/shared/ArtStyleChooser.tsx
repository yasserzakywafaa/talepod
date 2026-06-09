import { Box, ButtonBase } from "@mui/material";

import { ArtStyles } from "src/shared/artStyles";
import { CheckRounded } from "@mui/icons-material";
import { FC } from "react";
import { honey400 } from "src/application/shared/themes";

export interface ArtStyleChooserProps {
  value: string;
  onChange: (value: string) => void;
  variant?: "stacked" | "row";
}

/** Visual picker for the illustration art style (mirrors FormatChooser). */
const ArtStyleChooser: FC<ArtStyleChooserProps> = ({
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
        gap: stacked ? "10px" : "12px",
      }}
    >
      {ArtStyles.map((style) => {
        const isSelected = value === style.id;

        return (
          <ButtonBase
            key={style.id}
            onClick={() => onChange(style.id)}
            sx={{
              flex: 1,
              textAlign: "left",
              backgroundColor: "background.paper",
              borderRadius: "var(--r-lg)",
              padding: "10px",
              borderWidth: isSelected ? 1.5 : 1,
              borderStyle: "solid",
              borderColor: isSelected ? honey400 : "divider",
              boxShadow: isSelected
                ? "0 0 0 4px rgba(240,182,72,0.18), var(--shadow-sm)"
                : "var(--shadow-xs)",
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              gap: "8px",
              position: "relative",
            }}
          >
            <Box
              sx={{
                height: 100,
                borderRadius: "var(--r-md)",
                background: style.swatch,
                position: "relative",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              {style.thumbnail && (
                <Box
                  component="img"
                  src={style.thumbnail}
                  alt={`${style.label} sample`}
                  loading="lazy"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              )}
              {isSelected && (
                <CheckRounded
                  sx={{
                    color: "#fff",
                    position: "absolute",
                    padding: 0.25,
                    top: 6,
                    right: 6,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: honey400,
                  }}
                />
              )}
            </Box>
            <Box>
              <Box
                sx={{
                  fontFamily: "var(--font-display)",
                  fontSize: 14,
                  lineHeight: 1.2,
                  color: "text.primary",
                }}
              >
                {style.label}
              </Box>
              <Box
                sx={{
                  fontSize: 11,
                  color: "text.secondary",
                  marginTop: "2px",
                  lineHeight: 1.3,
                }}
              >
                {style.description}
              </Box>
            </Box>
          </ButtonBase>
        );
      })}
    </Box>
  );
};

export default ArtStyleChooser;
