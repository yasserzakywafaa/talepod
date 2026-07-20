import {
  PersonAddAlt1Rounded,
} from "@mui/icons-material";
import { Avatar, AvatarInput, avatarToInput } from "src/shared/types/avatar";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";

import AvatarCard from "src/components/shared/AvatarCard/AvatarCard";
import AvatarFormDialog from "./AvatarFormDialog";
import Page from "src/components/shared/Page/Page";
import { honey400 } from "src/application/shared/themes";
import routes from "src/application/routes";
import { useAvatars } from "./useAvatars";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";

const AvatarsPage = () => {
  const { t } = useTranslation("story");
  const navigate = useNavigate();
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
    <Page title={t("avatars.page.title")} isLoading={isLoading && !cards.length}>
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
                {t("avatars.page.title")}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {t("avatars.page.subtitle")}
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<PersonAddAlt1Rounded />}
              onClick={openCreate}
            >
              {t("avatars.page.new")}
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
              <Typography sx={{ mt: 1 }}>{t("avatars.page.empty")}</Typography>
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
        title={
          editing ? t("avatars.page.editTitle") : t("avatars.page.newTitle")
        }
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
        <DialogTitle>{t("avatars.delete.title")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Trans
              i18nKey="avatars.delete.body"
              ns="story"
              values={{ name: pendingDelete?.name }}
              components={{ strong: <strong /> }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button color="secondary" onClick={() => setPendingDelete(null)}>
            {t("avatars.delete.cancel")}
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmDelete}
          >
            {t("avatars.delete.confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
};

export default AvatarsPage;
