import {
  AutoStoriesOutlined,
  DeleteOutlineRounded,
  EditOutlined,
} from "@mui/icons-material";
import { Avatar } from "src/shared/types/avatar";
import { Box, Button, Chip, IconButton, Typography } from "@mui/material";

import LoaderSpinner from "src/components/shared/Loader/LoaderSpinner";

/** Short one-line trait summary shown under the avatar's name. */
const traitSummary = (avatar: Avatar): string =>
  [
    avatar.age !== undefined ? `${avatar.age} yrs` : "",
    avatar.gender,
    avatar.hairColor && `${avatar.hairColor} hair`,
    avatar.eyeColor && `${avatar.eyeColor} eyes`,
  ]
    .filter(Boolean)
    .join(" · ");

export interface AvatarCardProps {
  avatar: Avatar;
  /** Portrait is still being generated → overlay a spinner on the image. */
  pending?: boolean;
  /** A mutation is in flight for this avatar → disable its row actions. */
  disabled?: boolean;
  /** Hide create / edit / delete actions (display-only contexts). */
  readOnly?: boolean;
  /** Card density — `mini` for tight inline panels (e.g. story export). */
  size?: "default" | "compact" | "mini";
  onCreate?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const portraitHeight = (size: AvatarCardProps["size"]) => {
  if (size === "mini") return 88;
  if (size === "compact") return 160;
  return 400;
};

const AvatarCard = ({
  avatar,
  pending,
  disabled,
  readOnly = false,
  size = "default",
  onCreate,
  onEdit,
  onDelete,
}: AvatarCardProps) => {
  const isMini = size === "mini";
  const isCompact = size === "compact" || isMini;

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        borderRadius: isMini ? "var(--r-md)" : "var(--r-lg)",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "var(--shadow-xs)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          height: portraitHeight(size),
          position: "relative",
          background: avatar.portraitUrl
            ? `center / cover no-repeat url('${avatar.portraitUrl}')`
            : "linear-gradient(160deg,#F0B648,#C9622F)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!avatar.portraitUrl && !pending && (
          <Typography
            sx={{
              fontFamily: "var(--font-display)",
              fontSize: isMini ? 28 : isCompact ? 36 : 48,
              color: "#fff",
            }}
          >
            {avatar.name?.[0]?.toUpperCase() ?? "?"}
          </Typography>
        )}
        {pending && (
          <>
            <LoaderSpinner position="absolute" />
            <Typography
              sx={{
                position: "absolute",
                bottom: isMini ? "8%" : isCompact ? "12%" : "20%",
                width: "100%",
                textAlign: "center",
                color: "#fff",
                fontSize: isMini ? 11 : 13,
                zIndex: 1351,
              }}
            >
              Painting portrait…
            </Typography>
          </>
        )}
      </Box>
      <Box
        sx={{
          p: isMini ? 1 : isCompact ? 1.5 : 2,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap" }}
        >
          <Typography
            variant={isMini ? "body2" : isCompact ? "subtitle1" : "h6"}
            sx={{
              color: "text.primary",
              textTransform: "uppercase",
              fontFamily: "var(--font-display)",
              flex: 1,
              fontWeight: 600,
              fontSize: isMini ? "0.8rem" : isCompact ? "0.95rem" : undefined,
              lineHeight: 1.2
            }}>
            {avatar.name}
          </Typography>
          {avatar.relationship && (
            <Chip
              variant="badge"
              color="secondary"
              label={avatar.relationship}
              size={isMini ? "small" : "medium"}
            />
          )}
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            mt: 0.25,
            minHeight: isMini ? 0 : 20,
            fontSize: isMini ? 11 : undefined,
            lineHeight: 1.35,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: isMini ? "nowrap" : "normal",
          }}
        >
          {traitSummary(avatar)}
        </Typography>
        {!readOnly && (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              mt: "auto",
              pt: 1.5,
              alignItems: "center",
            }}
          >
            <Button
              size="small"
              variant="contained"
              startIcon={<AutoStoriesOutlined />}
              onClick={onCreate}
              disabled={disabled}
              sx={{ flex: 1 }}
            >
              Create
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              startIcon={<EditOutlined />}
              onClick={onEdit}
              disabled={disabled}
            >
              Edit
            </Button>
            <IconButton
              aria-label="delete avatar"
              color="error"
              onClick={onDelete}
              disabled={disabled}
            >
              <DeleteOutlineRounded />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AvatarCard;
