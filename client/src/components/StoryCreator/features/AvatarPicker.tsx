import { AddRounded, CheckRounded, LoginRounded } from "@mui/icons-material";
import { Box, Button, ButtonBase, Typography } from "@mui/material";
import { useEffect, useRef } from "react";

import { Avatar } from "src/shared/types/avatar";
import { Link } from "react-router-dom";
import { honey400 } from "src/application/shared/themes";
import routes from "src/application/routes";
import { useAvatars } from "src/Pages/Avatars/useAvatars";

export interface AvatarPickerProps {
  value?: string;
  /** Receives the avatar id and (when one is picked) the full avatar object. */
  onChange: (avatarId: string, avatar?: Avatar) => void;
  /** Only fetch/show when the user is authenticated (avatars are user-scoped). */
  enabled?: boolean;
  /**
   * When set (e.g. deep-linked from the My Avatars "Create" button via
   * `?avatarId=…`), auto-select that avatar once the list loads.
   */
  autoSelectId?: string;
  /** Logged-out CTA — opens the login modal from the placeholder. */
  onRequestLogin?: () => void;
}

const tileSx = (selected: boolean) => ({
  flex: "0 0 auto",
  // width: 92,
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
 * Inline picker shown in the create form: choose a saved avatar so the story's
 * hero resembles them, or "None". Links to the full management page. When the
 * user is logged out, shows a friendly login CTA instead of an empty space.
 */
const AvatarPicker = ({
  value,
  onChange,
  enabled = true,
  autoSelectId,
  onRequestLogin,
}: AvatarPickerProps) => {
  const { avatars, isLoading } = useAvatars(enabled);

  // One-shot: when an avatar is deep-linked, select it (and pre-fill the form)
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

  const Header = (
    <Box
      sx={{
        display: "flex",
        flexWrap: "nowrap",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="body2" color="text.secondary" fontWeight={600}>
        Avatar (optional)
      </Typography>
      {enabled && (
        <Button
          component={Link}
          to={routes.avatars}
          size="small"
          variant="text"
          sx={{ paddingTop: 0 }}
        >
          Manage avatars
        </Button>
      )}
    </Box>
  );

  // Logged out: avatars are user-scoped, so invite the user to sign in rather
  // than leaving a blank gap in the form.
  if (!enabled) {
    return (
      <Box sx={{ width: "100%" }}>
        {Header}
        <Box
          sx={{
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: "var(--r-md)",
            backgroundColor: "background.paper",
            p: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 1.25,
          }}
        >
          <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
            ✨ Want the hero to look like your child? Log in to create reusable
            avatars and star them in every story.
          </Typography>
          <Button
            size="small"
            variant="contained"
            startIcon={<LoginRounded />}
            onClick={onRequestLogin}
          >
            Log in
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      {Header}

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
          Create an avatar to make the hero look like your child or family.{" "}
          <Link
            to={routes.avatars}
            style={{ color: honey400, fontWeight: 600 }}
          >
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
            aria-label="No avatar"
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
                    width: 110,
                    height: 110,
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
                  {!avatar.portraitUrl &&
                    (avatar.name?.[0]?.toUpperCase() ?? "?")}
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
              </ButtonBase>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default AvatarPicker;
