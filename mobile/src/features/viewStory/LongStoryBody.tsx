import { useReadableLayout } from "src/components/layout/useReadableLayout";
import { Image, StyleSheet, View, useWindowDimensions } from "react-native";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";

import type { LongStoryImage } from "src/features/storyCreator/store/state";

type LongStoryBodyProps = {
  mainStory: string;
  longStoryImages?: LongStoryImage[];
  /**
   * Illustrations are pending and none have landed yet. A comic page shows a
   * spinner box where its picture will go; long-format prose had nothing
   * equivalent, so an image-less story just looked finished. This renders one
   * placeholder ahead of the text — not at a specific paragraph break, since
   * that position isn't known until the images actually arrive.
   */
  showPendingPlaceholder?: boolean;
};

const splitParagraphs = (text: string): string[] =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

const getImageBreakPoints = (
  paragraphCount: number,
  imageCount: number,
): number[] => {
  if (paragraphCount <= 1 || imageCount <= 0) return [];

  if (imageCount === 1) {
    return [Math.min(paragraphCount - 1, Math.floor(paragraphCount / 2))];
  }

  return [
    Math.min(paragraphCount - 1, Math.floor(paragraphCount * 0.33)),
    Math.min(paragraphCount - 1, Math.floor(paragraphCount * 0.66)),
  ].slice(0, imageCount);
};

export const LongStoryBody = ({
  mainStory,
  longStoryImages,
  showPendingPlaceholder = false,
}: LongStoryBodyProps) => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const { contentMaxWidth } = useReadableLayout();
  // Capped so a landscape window does not produce an image taller than the screen.
  const imageWidth = Math.min(width, contentMaxWidth) - 32;
  const bodyStyle = {
    color: theme.colors.onSurface,
    lineHeight: 26 as const,
  };

  const placeholder = showPendingPlaceholder ? (
    <View
      style={[
        styles.placeholder,
        {
          width: imageWidth,
          height: imageWidth * (9 / 16),
          backgroundColor: theme.colors.surfaceVariant,
        },
      ]}
    >
      <ActivityIndicator color={theme.colors.primary} />
    </View>
  ) : null;

  const interiorImages = (longStoryImages ?? [])
    .filter((img) => img.imageUrl)
    .sort((a, b) => a.index - b.index);

  if (!interiorImages.length) {
    return (
      <View style={styles.container}>
        {placeholder}
        <Text variant="bodyLarge" style={bodyStyle}>
          {mainStory}
        </Text>
      </View>
    );
  }

  const paragraphs = splitParagraphs(mainStory);
  const breakPoints = getImageBreakPoints(
    paragraphs.length,
    interiorImages.length,
  );

  if (!paragraphs.length || !breakPoints.length) {
    return (
      <View style={styles.container}>
        {placeholder}
        <Text variant="bodyLarge" style={bodyStyle}>
          {mainStory}
        </Text>
      </View>
    );
  }

  const blocks: React.ReactNode[] = [];
  let imageCursor = 0;

  paragraphs.forEach((paragraph, index) => {
    blocks.push(
      <Text
        key={`p-${index}`}
        variant="bodyLarge"
        style={[bodyStyle, styles.paragraph]}
      >
        {paragraph}
      </Text>,
    );

    if (
      breakPoints[imageCursor] === index &&
      interiorImages[imageCursor]?.imageUrl
    ) {
      const img = interiorImages[imageCursor];
      blocks.push(
        <Image
          key={`img-${img.index}`}
          source={{ uri: img.imageUrl }}
          style={[
            styles.image,
            { width: imageWidth, height: imageWidth * (9 / 16) },
          ]}
          resizeMode="cover"
        />,
      );
      imageCursor += 1;
    }
  });

  return <View style={styles.container}>{blocks}</View>;
};

const styles = StyleSheet.create({
  container: { gap: 4 },
  paragraph: { marginBottom: 12 },
  image: {
    borderRadius: 16,
    marginVertical: 12,
    alignSelf: "center",
  },
  placeholder: {
    borderRadius: 16,
    marginBottom: 12,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
});
