import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import {
  AutoStoriesOutlined,
  DeleteOutlineRounded,
  EditOutlined,
  PersonAddAlt1Rounded,
} from "@mui/icons-material";
import { Notify, ToastTypes } from "src/components/shared/Notification/Notification";

import { Avatar, AvatarInput, avatarToInput } from "src/shared/types/avatar";
import AvatarFormDialog from "./AvatarFormDialog";
import Page from "src/components/shared/Page/Page";
import { honey400 } from "src/application/shared/themes";
import routes from "src/application/routes";
import { useAvatars } from "./useAvatars";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

/** Short one-line trait summary shown under the character's name. */
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
  onCreate,
  onEdit,
  onDelete,
}: {
  avatar: Avatar;
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
        height: 150,
        background: avatar.portraitUrl
          ? `center / cover no-repeat url('${avatar.portraitUrl}')`
          : "linear-gradient(160deg,#F0B648,#C9622F)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {!avatar.portraitUrl && (
        <Typography
          sx={{ fontFamily: "var(--font-display)", fontSize: 48, color: "#fff" }}
        >
          {avatar.name?.[0]?.toUpperCase() ?? "?"}
        </Typography>
      )}
    </Box>
    <Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column" }}>
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}
      >
        <Typography
          sx={{ fontFamily: "var(--font-display)", fontSize: 18, flex: 1 }}
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
        sx={{ display: "flex", gap: 1, mt: "auto", pt: 1.5, alignItems: "center" }}
      >
        <Button
          size="small"
          variant="contained"
          startIcon={<AutoStoriesOutlined />}
          onClick={onCreate}
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
        >
          Edit
        </Button>
        <IconButton
          aria-label="delete character"
          color="error"
          onClick={onDelete}
        >
          <DeleteOutlineRounded />
        </IconButton>
      </Box>
    </Box>
  </Box>
);

const CharactersPage = () => {
  const navigate = useNavigate();
  const {
    avatars,
    isLoading,
    isSaving,
    fetchAvatars,
    createAvatar,
    updateAvatar,
    deleteAvatar,
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

  const handleSubmit = async (input: AvatarInput) => {
    try {
      if (editing) {
        await updateAvatar(editing._id, input);
        Notify({ type: ToastTypes.Success, content: "Character updated." });
      } else {
        await createAvatar(input);
        Notify({ type: ToastTypes.Success, content: "Character created." });
      }
      setDialogOpen(false);
      setEditing(null);
      // The portrait is generated server-side in the background — refresh
      // shortly so it appears without a manual reload.
      window.setTimeout(() => fetchAvatars(), 12000);
    } catch (error) {
      Notify({ type: ToastTypes.Error, content: "Something went wrong." });
    }
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteAvatar(pendingDelete._id);
      Notify({ type: ToastTypes.Success, content: "Character deleted." });
    } catch (error) {
      Notify({ type: ToastTypes.Error, content: "Failed to delete character." });
    } finally {
      setPendingDelete(null);
    }
  };

  return (
    <Page title="My Characters" isLoading={isLoading && !avatars.length}>
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
              My Characters
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Create characters so stories star people who look like your family.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<PersonAddAlt1Rounded />}
            onClick={openCreate}
          >
            New character
          </Button>
        </Box>

        {!isLoading && !avatars.length ? (
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
              No characters yet. Create your first one!
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
            {avatars.map((avatar) => (
              <AvatarCard
                key={avatar._id}
                avatar={avatar}
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

      <AvatarFormDialog
        open={dialogOpen}
        title={editing ? "Edit character" : "New character"}
        initialValue={editing ? avatarToInput(editing) : undefined}
        isSaving={isSaving}
        onClose={() => {
          setDialogOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
      />

      <Dialog open={Boolean(pendingDelete)} onClose={() => setPendingDelete(null)}>
        <DialogTitle>Delete character?</DialogTitle>
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
          <Button color="error" variant="contained" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
};

export default CharactersPage;
