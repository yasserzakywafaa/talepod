import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "src/application/theme/useAppTheme";
import { BrandBadge } from "src/components/brand/BrandBadge";
import { BrandCard } from "src/components/brand/BrandCard";
import { DisplayText } from "src/components/brand/DisplayText";
import { PillButton } from "src/components/brand/PillButton";
import { Gradient } from "src/components/shared/Gradient";
import type { Avatar } from "src/shared/types/avatar";

/** One-line trait summary under the name — same fields the web card joins. */
const traitSummary = (avatar: Avatar): string =>
  [
    avatar.age !== undefined ? `${avatar.age} yrs` : "",
    avatar.gender,
    avatar.hairColor && `${avatar.hairColor} hair`,
    avatar.eyeColor && `${avatar.eyeColor} eyes`,
  ]
    .filter(Boolean)
    .join(" · ");

type AvatarCardProps = {
  avatar: Avatar;
  /**
   * A mutation is in flight for this specific avatar — the whole card dims
   * and its actions disable, not just the buttons. Previously this flipped
   * for every card on screen at once (one shared `isSaving` flag), so editing
   * one avatar visibly disabled every other card's buttons too, with no way
   * to tell which one was actually doing something.
   */
  disabled?: boolean;
  /**
   * The server is painting (or re-painting) this avatar's portrait in the
   * background — create and an appearance-changing edit both return before
   * it exists. Overlays a spinner on the portrait until it lands.
   */
  portraitPending?: boolean;
  onCreate: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

/**
 * Full-bleed avatar card — the native read of the web `AvatarCard`: a tall
 * portrait, then the name with its relationship badge, the trait line, and
 * the create / edit / delete row.
 */
export const AvatarCard = ({
  avatar,
  disabled = false,
  portraitPending = false,
  onCreate,
  onEdit,
  onDelete,
}: AvatarCardProps) => {
  const { t } = useTranslation("story");
  const theme = useAppTheme();
  const { fontFamily, radius } = theme.tokens;

  const traits = traitSummary(avatar);

  return (
    <BrandCard style={disabled ? styles.dimmed : undefined}>
      <View style={styles.portrait}>
        {avatar.portraitUrl ? (
          <Image
            source={{ uri: avatar.portraitUrl }}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
        ) : (
          // Web falls back to a honey→rust wash with the initial letter.
          <Gradient
            colors={["#F0B648", "#C9622F"] as const}
            style={[StyleSheet.absoluteFillObject, styles.fallback]}
          >
            {!portraitPending ? (
              <DisplayText size={48} color="#FFFFFF">
                {avatar.name?.[0]?.toUpperCase() ?? "?"}
              </DisplayText>
            ) : null}
          </Gradient>
        )}

        {portraitPending ? (
          <View style={styles.paintingOverlay}>
            <ActivityIndicator color="#FFFFFF" />
            <Text style={styles.paintingLabel}>
              {t("avatars.card.paintingPortrait")}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <DisplayText size={20} numberOfLines={1} style={styles.name}>
            {avatar.name.toUpperCase()}
          </DisplayText>
          {avatar.relationship ? (
            <BrandBadge label={avatar.relationship} tone="secondary" />
          ) : null}
        </View>

        {traits ? (
          <Text
            numberOfLines={2}
            style={[
              styles.traits,
              {
                color: theme.colors.onSurfaceVariant,
                fontFamily: fontFamily.regular,
              },
            ]}
          >
            {traits}
          </Text>
        ) : null}

        <View style={styles.actions}>
          <PillButton
            compact
            icon="book-open-variant"
            onPress={onCreate}
            disabled={disabled}
            style={styles.createAction}
          >
            {t("avatars.card.create")}
          </PillButton>

          <PillButton
            variant="outlined"
            compact
            icon="pencil-outline"
            onPress={onEdit}
            disabled={disabled}
            color={theme.colors.secondary}
          >
            {t("avatars.card.edit")}
          </PillButton>

          <Pressable
            onPress={onDelete}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={t("avatars.card.delete")}
            hitSlop={8}
            style={({ pressed }) => [
              styles.deleteAction,
              { borderRadius: radius.pill, opacity: disabled || pressed ? 0.5 : 1 },
            ]}
          >
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={22}
              color={theme.colors.error}
            />
          </Pressable>
        </View>
      </View>
    </BrandCard>
  );
};

const styles = StyleSheet.create({
  portrait: { width: "100%", aspectRatio: 1, overflow: "hidden" },
  fallback: { alignItems: "center", justifyContent: "center" },
  dimmed: { opacity: 0.55 },
  paintingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  paintingLabel: { color: "#FFFFFF", fontSize: 12, fontWeight: "600" },
  body: { padding: 16, gap: 6 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  name: { flex: 1 },
  traits: { fontSize: 14, lineHeight: 20, includeFontPadding: false },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  createAction: { flex: 1 },
  deleteAction: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
