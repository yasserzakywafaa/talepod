import {
  AutoStoriesOutlined,
  DeleteOutlineRounded,
  EditOutlined,
  PersonAddAlt1Rounded,
} from "@mui/icons-material";
import { Avatar, AvatarInput, avatarToInput } from "src/shared/types/avatar";
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";

import AvatarFormDialog from "./AvatarFormDialog";
import LoaderSpinner from "src/components/shared/Loader/LoaderSpinner";
import Page from "src/components/shared/Page/Page";
import { honey400 } from "src/application/shared/themes";
import routes from "src/application/routes";
import { useAvatars } from "./useAvatars";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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

const AvatarCard = ({
  avatar,
  pending,
  disabled,
  onCreate,
  onEdit,
  onDelete,
}: {
  avatar: Avatar;
  /** Portrait is still being generated → overlay a spinner on the image. */
  pending?: boolean;
  /** A mutation is in flight for this avatar → disable its row actions. */
  disabled?: boolean;
  onCreate: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <Box
    sx={{
      backgroundColor: "background.paper",
      borderRadius: "var(--r-lg)",
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
        height: 400,
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
            fontSize: 48,
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
              bottom: "20%",
              width: "100%",
              textAlign: "center",
              color: "#fff",
              fontSize: 13,
              zIndex: 1351,
            }}
          >
            Painting portrait…
          </Typography>
        </>
      )}
    </Box>
    <Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column" }}>
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}
      >
        <Typography
          variant="h6"
          color="text.primary"
          textTransform="uppercase"
          sx={{ fontFamily: "var(--font-display)", flex: 1, fontWeight: 600 }}
        >
          {avatar.name}
        </Typography>
        {avatar.relationship && (
          <Chip variant="badge" color="secondary" label={avatar.relationship} />
        )}
      </Box>
      <Typography
        variant="body2"
        sx={{ color: "text.secondary", mt: 0.5, minHeight: 20 }}
      >
        {traitSummary(avatar)}
      </Typography>
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
    </Box>
  </Box>
);

const AvatarsPage = () => {
  const navigate = useNavigate();
  // All the heavy lifting (optimistic cards, portrait polling, create/update/
  // delete flows + toasts, per-card pending/busy state) lives in the hook; the
  // page only owns which dialog is open.
  const {
    cards,
    isLoading,
    isSaving,
    isPortraitPending,
    isBusy,
    saveAvatar,
    removeAvatar,
  } = useAvatars();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Avatar | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Avatar | null>(null);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (avatar: Avatar) => {
    setEditing(avatar);
    setDialogOpen(true);
  };

  const handleSubmit = (input: AvatarInput) => {
    const target = editing;
    // Close immediately — the hook shows the optimistic card / painting overlay
    // and runs the request in the background.
    setDialogOpen(false);
    setEditing(null);
    void saveAvatar(input, target);
  };

  const handleConfirmDelete = () => {
    const target = pendingDelete;
    setPendingDelete(null);
    if (target) void removeAvatar(target);
  };

  const showEmpty = !isLoading && !cards.length;

  return (
    <Page title="My Avatars" isLoading={isLoading && !cards.length}>
      <Container>
        <Box sx={{ maxWidth: 1100, mx: "auto", width: "100%", py: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              mb: 1,
              flexWrap: "wrap",
            }}
          >
            <Box>
              <Typography
                sx={{ fontFamily: "var(--font-display)", fontSize: 28 }}
              >
                My Avatars
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Create avatars so stories star people who look like your family.
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<PersonAddAlt1Rounded />}
              onClick={openCreate}
            >
              New avatar
            </Button>
          </Box>

          {showEmpty ? (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                color: "text.secondary",
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: "var(--r-lg)",
                mt: 2,
              }}
            >
              <PersonAddAlt1Rounded sx={{ fontSize: 48, color: honey400 }} />
              <Typography sx={{ mt: 1 }}>
                No avatars yet. Create your first one!
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr 1fr",
                },
                gap: 2,
                mt: 2,
              }}
            >
              {cards.map((avatar) => (
                <AvatarCard
                  key={avatar._id}
                  avatar={avatar}
                  pending={isPortraitPending(avatar._id)}
                  disabled={isBusy(avatar._id)}
                  onCreate={() =>
                    navigate(`${routes.create}?avatarId=${avatar._id}`)
                  }
                  onEdit={() => openEdit(avatar)}
                  onDelete={() => setPendingDelete(avatar)}
                />
              ))}
            </Box>
          )}
        </Box>
      </Container>

      <AvatarFormDialog
        open={dialogOpen}
        title={editing ? "Edit avatar" : "New avatar"}
        initialValue={editing ? avatarToInput(editing) : undefined}
        isSaving={isSaving}
        onClose={() => {
          setDialogOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
      />

      <Dialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
      >
        <DialogTitle>Delete avatar?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Delete <strong>{pendingDelete?.name}</strong>? This can't be undone.
            Existing stories are not affected.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button color="secondary" onClick={() => setPendingDelete(null)}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
};

export default AvatarsPage;
