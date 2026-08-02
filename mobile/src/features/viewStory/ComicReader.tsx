import { useCallback, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Text } from "react-native-paper";

import { useAppTheme } from "src/application/theme/useAppTheme";
import { DisplayText } from "src/components/brand/DisplayText";
import type { ComicPage } from "src/features/storyCreator/store/state";

const PAGE_ASPECT = 4 / 3;
const GRID_MIN_TILE = 150;

type ComicReaderProps = {
  pages: ComicPage[];
  /** Width available to the reader, already inside the page gutters. */
  width: number;
};

/**
 * Paged comic reader, matching the web's swipe-through-scenes experience: one
 * page at a time with its caption, a dot strip, and a thumbnail grid to jump.
 * The previous mobile reader stacked every page vertically, which read as a
 * long scroll rather than a book.
 */
export const ComicReader = ({ pages, width }: ComicReaderProps) => {
  const { t } = useTranslation("story");
  const theme = useAppTheme();
  const listRef = useRef<FlatList<ComicPage>>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showGrid, setShowGrid] = useState(false);

  const total = pages.length;
  const imageHeight = width / PAGE_ASPECT;

  const goTo = useCallback((index: number) => {
    setActiveIndex(index);
    listRef.current?.scrollToOffset({
      offset: index * width,
      animated: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  const onScrollEnd = useCallback(
    (offsetX: number) => {
      const next = Math.round(offsetX / width);
      if (next !== activeIndex) setActiveIndex(next);
    },
    [width, activeIndex],
  );

  if (!total) return null;

  if (showGrid) {
    const columns = Math.max(2, Math.floor(width / GRID_MIN_TILE));
    const tileWidth = (width - 12 * (columns - 1)) / columns;

    return (
      <View style={styles.gridRoot}>
        <View style={styles.gridHeader}>
          <Text
            variant="bodySmall"
            style={{ color: theme.colors.onSurfaceVariant, flex: 1 }}
          >
            {t("reader.comic.gridHint", { total })}
          </Text>
          <Pressable
            onPress={() => setShowGrid(false)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={t("reader.comic.closeAria")}
          >
            <MaterialCommunityIcons
              name="close"
              size={22}
              color={theme.colors.onSurface}
            />
          </Pressable>
        </View>

        <View style={styles.gridWrap}>
          {pages.map((page, index) => (
            <Pressable
              key={page.index ?? index}
              onPress={() => {
                setShowGrid(false);
                goTo(index);
              }}
              style={[
                styles.tile,
                {
                  width: tileWidth,
                  borderRadius: theme.tokens.radius.lg,
                  backgroundColor: theme.colors.surface,
                  borderColor:
                    index === activeIndex
                      ? theme.tokens.brand.honey[400]
                      : theme.colors.outlineVariant,
                  borderWidth: index === activeIndex ? 2 : StyleSheet.hairlineWidth,
                },
              ]}
            >
              <View
                style={[
                  styles.tileArt,
                  {
                    height: tileWidth / PAGE_ASPECT,
                    backgroundColor: theme.colors.surfaceVariant,
                  },
                ]}
              >
                {page.imageUrl ? (
                  <Image
                    source={{ uri: page.imageUrl }}
                    style={StyleSheet.absoluteFillObject}
                    resizeMode="cover"
                  />
                ) : (
                  <ActivityIndicator size="small" color={theme.colors.primary} />
                )}
                <View style={styles.tileBadge}>
                  <Text style={styles.tileBadgeText}>{index + 1}</Text>
                </View>
              </View>
              <Text
                numberOfLines={2}
                variant="bodySmall"
                style={[styles.tileCaption, { color: theme.colors.onSurfaceVariant }]}
              >
                {page.caption}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <FlatList
        ref={listRef}
        data={pages}
        keyExtractor={(page, index) => `${page.index ?? index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        // Every page is exactly `width`, so the list can place them without
        // measuring — which is also what makes `scrollToOffset` exact.
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        onMomentumScrollEnd={(event) =>
          onScrollEnd(event.nativeEvent.contentOffset.x)
        }
        renderItem={({ item, index }) => (
          <View style={{ width }}>
            <View
              style={[
                styles.art,
                {
                  height: imageHeight,
                  borderRadius: theme.tokens.radius.lg,
                  backgroundColor: theme.colors.surfaceVariant,
                },
              ]}
            >
              {item.imageUrl ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={StyleSheet.absoluteFillObject}
                  resizeMode="cover"
                />
              ) : (
                <ActivityIndicator color={theme.colors.primary} />
              )}

              <Pressable
                onPress={() => setShowGrid(true)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={t("reader.comic.allPagesAria")}
                style={styles.gridButton}
              >
                <MaterialCommunityIcons
                  name="view-grid-outline"
                  size={18}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            {/* Caption stays in its own card, readable regardless of how the
                illustration turned out. */}
            <View
              style={[
                styles.caption,
                {
                  borderRadius: theme.tokens.radius.lg,
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.outlineVariant,
                },
              ]}
            >
              <DisplayText size={16} color={theme.tokens.brand.honey[300]}>
                {t("reader.comic.pageOf", { current: index + 1, total })}
              </DisplayText>
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                {item.caption}
              </Text>
            </View>
          </View>
        )}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dots}
      >
        {pages.map((page, index) => (
          <Pressable
            key={page.index ?? index}
            onPress={() => goTo(index)}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel={t("reader.comic.pageOf", {
              current: index + 1,
              total,
            })}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === activeIndex
                    ? theme.tokens.brand.honey[400]
                    : theme.colors.outlineVariant,
                width: index === activeIndex ? 22 : 8,
              },
            ]}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { gap: 12 },
  art: {
    width: "100%",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  gridButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  caption: {
    marginTop: 14,
    padding: 14,
    gap: 4,
    borderWidth: StyleSheet.hairlineWidth,
  },
  dots: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 4,
    flexGrow: 1,
  },
  dot: { height: 8, borderRadius: 4 },
  gridRoot: { gap: 12 },
  gridHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  gridWrap: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  tile: { overflow: "hidden" },
  tileArt: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  tileBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  tileBadgeText: { color: "#FFFFFF", fontSize: 10, fontWeight: "700" },
  tileCaption: { padding: 8 },
});
