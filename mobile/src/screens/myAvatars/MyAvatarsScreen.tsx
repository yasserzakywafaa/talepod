import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Button,
  Card,
  Dialog,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";

import END_POINTS from "src/application/shared/endpoints";
import { api } from "src/application/shared/apiClient";
import { useReadableLayout } from "src/components/layout/useReadableLayout";
import { AvatarFormDialog } from "src/features/myAvatars/AvatarFormDialog";
import {
  EMPTY_AVATAR_INPUT,
  type Avatar,
  type AvatarInput,
  avatarToInput,
} from "src/shared/types/avatar";

export const useMyAvatars = (enabled = true) => {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchAvatars = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get<Avatar[]>(END_POINTS.AVATARS.LIST);
      setAvatars(Array.isArray(data) ? data : []);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) void fetchAvatars();
  }, [enabled, fetchAvatars]);

  const saveAvatar = async (input: AvatarInput, existing: Avatar | null) => {
    setIsSaving(true);
    try {
      if (existing) {
        const { data } = await api.put<Avatar>(
          END_POINTS.AVATARS.UPDATE(existing._id),
          input,
        );
        setAvatars((prev) => prev.map((a) => (a._id === existing._id ? data : a)));
      } else {
        const { data } = await api.post<Avatar>(END_POINTS.AVATARS.CREATE, input);
        setAvatars((prev) => [data, ...prev]);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const removeAvatar = async (avatar: Avatar) => {
    setIsSaving(true);
    try {
      await api.delete(END_POINTS.AVATARS.DELETE(avatar._id));
      setAvatars((prev) => prev.filter((a) => a._id !== avatar._id));
    } finally {
      setIsSaving(false);
    }
  };

  return {
    avatars,
    isLoading,
    isSaving,
    refetch: fetchAvatars,
    saveAvatar,
    removeAvatar,
  };
};

export const MyAvatarsScreen = () => {
  const { t } = useTranslation("story");
  const theme = useTheme();
  const { horizontalGutter, contentMaxWidth } = useReadableLayout();
  const { avatars, isLoading, isSaving, saveAvatar, removeAvatar } =
    useMyAvatars(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Avatar | null>(null);
  const [form, setForm] = useState<AvatarInput>(EMPTY_AVATAR_INPUT);
  const [deleteTarget, setDeleteTarget] = useState<Avatar | null>(null);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_AVATAR_INPUT);
    setDialogOpen(true);
  };

  const openEdit = (avatar: Avatar) => {
    setEditing(avatar);
    setForm(avatarToInput(avatar));
    setDialogOpen(true);
  };

  const onSubmit = (input: AvatarInput) => {
    void saveAvatar(input, editing).then(() => setDialogOpen(false));
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={avatars}
        keyExtractor={(item) => item._id}
        contentContainerStyle={[
          styles.list,
          {
            paddingHorizontal: horizontalGutter,
            maxWidth: contentMaxWidth,
            alignSelf: "center",
            width: "100%",
          },
        ]}
        ListHeaderComponent={
          <View style={styles.header}>
            <Button mode="contained" onPress={openCreate} icon="plus">
              {t("avatars.page.new")}
            </Button>
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator style={{ marginTop: 24 }} />
          ) : (
            <Text style={{ color: theme.colors.onSurfaceVariant, marginTop: 16 }}>
              {t("avatars.page.empty")}
            </Text>
          )
        }
        renderItem={({ item }) => (
          <Card mode="outlined" style={styles.card}>
            <View style={styles.cardRow}>
              {item.portraitUrl ? (
                <Image source={{ uri: item.portraitUrl }} style={styles.portrait} />
              ) : (
                <View
                  style={[
                    styles.portrait,
                    { backgroundColor: theme.colors.surfaceVariant },
                  ]}
                />
              )}
              <View style={styles.cardText}>
                <Text variant="titleMedium">{item.name}</Text>
                {item.relationship ? (
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.onSurfaceVariant }}
                  >
                    {item.relationship}
                  </Text>
                ) : null}
                <View style={styles.cardActions}>
                  <Button mode="outlined" onPress={() => openEdit(item)} compact>
                    {t("avatars.page.editTitle")}
                  </Button>
                  <Button
                    mode="text"
                    textColor={theme.colors.error}
                    onPress={() => setDeleteTarget(item)}
                    compact
                  >
                    {t("avatars.delete.confirm")}
                  </Button>
                </View>
              </View>
            </View>
          </Card>
        )}
      />

      <Portal>
        <AvatarFormDialog
          visible={dialogOpen}
          title={
            editing ? t("avatars.page.editTitle") : t("avatars.page.newTitle")
          }
          initialValue={form}
          isSaving={isSaving}
          onDismiss={() => setDialogOpen(false)}
          onSubmit={onSubmit}
        />

        <Dialog visible={deleteTarget !== null} onDismiss={() => setDeleteTarget(null)}>
          <Dialog.Title>{t("avatars.delete.title")}</Dialog.Title>
          <Dialog.Content>
            <Text>{t("avatars.delete.body", { name: deleteTarget?.name ?? "" })}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteTarget(null)}>{t("avatars.delete.cancel")}</Button>
            <Button
              textColor={theme.colors.error}
              onPress={() => {
                if (deleteTarget) void removeAvatar(deleteTarget);
                setDeleteTarget(null);
              }}
            >
              {t("avatars.delete.confirm")}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  list: { paddingBottom: 24 },
  header: { paddingTop: 8, marginBottom: 12 },
  card: { marginBottom: 12 },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  portrait: { width: 64, height: 64, borderRadius: 32 },
  cardText: { flex: 1, gap: 4 },
  cardActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
});
