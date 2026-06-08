import { Box, ButtonBase, Typography } from "@mui/material";
import { AddRounded, CheckRounded } from "@mui/icons-material";
import { useEffect, useRef } from "react";

import { Avatar } from "src/shared/types/avatar";
import { Link } from "react-router-dom";
import { honey400 } from "src/application/shared/themes";
import routes from "src/application/routes";
import { useAvatars } from "src/Pages/Characters/useAvatars";

export interface CharacterPickerProps {
  value?: string;
  /** Receives the avatar id and (when one is picked) the full avatar object. */
  onChange: (avatarId: string, avatar?: Avatar) => void;
  /** Only fetch/show when the user is authenticated (avatars are user-scoped). */
  enabled?: boolean;
  /**
   * When set (e.g. deep-linked from the My Characters "Create" button via
   * `?avatarId=…`), auto-select that character once the list loads.
   */
  autoSelectId?: string;
}

const tileSx = (selected: boolean) => ({
  flex: "0 0 auto",
  width: 92,
  p: 1,
  borderRadius: "var(--r-md)",
  border: "1.5px solid",
  borderColor: selected ? honey400 : "divider",
  backgroundColor: "background.paper",
  boxShadow: selected ? "0 0 0 3px rgba(240,182,72,0.18)" : "var(--shadow-xs)",
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  gap: 0.5,
  position: "relative" as const,
});

/**
 * Inline picker shown in the create form: choose a saved character (avatar) so
 * the story's hero resembles them, or "None". Links to the full management page.
 */
const CharacterPicker = ({
  value,
  onChange,
  enabled = true,
  autoSelectId,
}: CharacterPickerProps) => {
  const { avatars, isLoading } = useAvatars(enabled);

  // One-shot: when a character is deep-linked, select it (and pre-fill the form)
  // as soon as the list resolves.
  const autoFiredRef = useRef(false);
  useEffect(() => {
    if (!enabled || autoFiredRef.current || !autoSelectId) return;
    const match = avatars.find((avatar) => avatar._id === autoSelectId);
    if (match) {
      autoFiredRef.current = true;
      onChange(match._id, match);
    }
  }, [enabled, autoSelectId, avatars, onChange]);

  if (!enabled) return null;

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Box sx={{ fontSize: 13, fontWeight: 600, color: "text.secondary" }}>
          Character (optional)
        </Box>
        <Link
          to={routes.characters}
          style={{ fontSize: 12, color: honey400, fontWeight: 600 }}
        >
          Manage characters
        </Link>
      </Box>

      {!isLoading && avatars.length === 0 ? (
        <Box
          sx={{
            fontSize: 12,
            color: "text.secondary",
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: "var(--r-md)",
            p: 1.5,
          }}
        >
          Create a character to make the hero look like your child or family.{" "}
          <Link to={routes.characters} style={{ color: honey400, fontWeight: 600 }}>
            Add one →
          </Link>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            overflowX: "auto",
            pb: 1,
          }}
        >
          {/* None option */}
          <ButtonBase
            onClick={() => onChange("")}
            sx={tileSx(!value)}
            aria-label="No character"
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                border: "1.5px dashed",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "text.secondary",
              }}
            >
              <AddRounded />
            </Box>
            <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
              None
            </Typography>
          </ButtonBase>

          {avatars.map((avatar) => {
            const selected = value === avatar._id;
            return (
              <ButtonBase
                key={avatar._id}
                onClick={() => onChange(avatar._id, avatar)}
                sx={tileSx(selected)}
                aria-label={`Use ${avatar.name}`}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    overflow: "hidden",
                    background: avatar.portraitUrl
                      ? `center / cover no-repeat url('${avatar.portraitUrl}')`
                      : "linear-gradient(160deg,#F0B648,#C9622F)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontFamily: "var(--font-display)",
                    fontSize: 22,
                  }}
                >
                  {!avatar.portraitUrl && (avatar.name?.[0]?.toUpperCase() ?? "?")}
                </Box>
                <Typography
                  sx={{
                    fontSize: 11,
                    color: "text.primary",
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {avatar.name}
                </Typography>
                {selected && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: honey400,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CheckRounded sx={{ fontSize: 12, color: "#fff" }} />
                  </Box>
                )}
              </ButtonBase>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default CharacterPicker;
