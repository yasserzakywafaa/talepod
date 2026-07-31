import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Dialog, Portal, Button } from "react-native-paper";

import END_POINTS from "src/application/shared/endpoints";
import { api } from "src/application/shared/apiClient";
import { navigateToCreateStory } from "src/application/navigation/rootNavigation";
import { useAppTheme } from "src/application/theme/useAppTheme";
import { Page, PAGE_SCROLL_PROPS } from "src/components/layout/Page";
import { MainShellAppBar } from "src/components/chrome/MainShellAppBar";
import { useReadableLayout } from "src/components/layout/useReadableLayout";
import { AvatarCard } from "src/components/brand/AvatarCard";
import { DisplayText } from "src/components/brand/DisplayText";
import { PillButton } from "src/components/brand/PillButton";
import { AvatarFormDialog } from "src/features/myAvatars/AvatarFormDialog";
import { useStoryCreatorContext } from "src/features/storyCreator/store/Provider";
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

  return (
    <Page header={<MainShellAppBar title={t("avatars.page.title")} />}>
      <MyAvatarsScreenContent />
    </Page>
  );
};

const MyAvatarsScreenContent = () => {
  const { t } = useTranslation("story");
  const theme = useAppTheme();
  const { horizontalGutter, contentMaxWidth } = useReadableLayout();
  const { avatars, isLoading, isSaving, saveAvatar, removeAvatar } =
    useMyAvatars(true);
  const {
    manager: { handleSelectAvatar },
  } = useStoryCreatorContext();

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

  /**
   * Mirrors the web's `?avatarId=` deep link from the avatars page: seed the
   * creator with this character, then jump to the form.
   */
  const startStoryWith = (avatar: Avatar) => {
    handleSelectAvatar(avatar);
    navigateToCreateStory();
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={avatars}
        keyExtractor={(item) => item._id}
        {...PAGE_SCROLL_PROPS}
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
            <Text
              style={[
                styles.subtitle,
                {
                  color: theme.colors.onSurfaceVariant,
                  fontFamily: theme.tokens.fontFamily.regular,
                },
              ]}
            >
              {t("avatars.page.subtitle")}
            </Text>
            <PillButton icon="plus" onPress={openCreate} fullWidth>
              {t("avatars.page.new")}
            </PillButton>
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator
              style={styles.loader}
              color={theme.colors.primary}
            />
          ) : (
            <Text
              style={[
                styles.empty,
                {
                  color: theme.colors.onSurfaceVariant,
                  fontFamily: theme.tokens.fontFamily.regular,
                },
              ]}
            >
              {t("avatars.page.empty")}
            </Text>
          )
        }
        renderItem={({ item }) => (
          <AvatarCard
            avatar={item}
            disabled={isSaving}
            onCreate={() => startStoryWith(item)}
            onEdit={() => openEdit(item)}
            onDelete={() => setDeleteTarget(item)}
          />
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

        <Dialog
          visible={deleteTarget !== null}
          onDismiss={() => setDeleteTarget(null)}
          style={{ borderRadius: theme.tokens.radius.lg }}
        >
          <Dialog.Title>
            <DisplayText size={20}>{t("avatars.delete.title")}</DisplayText>
          </Dialog.Title>
          <Dialog.Content>
            <Text
              style={{
                color: theme.colors.onSurfaceVariant,
                fontFamily: theme.tokens.fontFamily.regular,
              }}
            >
              {t("avatars.delete.body", {
                name: deleteTarget?.name ?? "",
              }).replace(/<\/?strong>/g, "")}
            </Text>
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
  list: { paddingBottom: 24, gap: 16 },
  header: { marginBottom: 4, gap: 12 },
  subtitle: { fontSize: 14, lineHeight: 21, includeFontPadding: false },
  loader: { marginTop: 24 },
  empty: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 16,
    includeFontPadding: false,
  },
});
