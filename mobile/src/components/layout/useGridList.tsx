import { useMemo } from "react";
import type { ViewStyle } from "react-native";

import { useReadableLayout } from "src/components/layout/useReadableLayout";
import { useBreakpoint } from "src/components/layout/useBreakpoint";

const DEFAULT_GAP = 16;

/**
 * One card grid for every list in the app, so a tablet fills its width the
 * same way everywhere. Widths are computed rather than left to `flex: 1`,
 * which would stretch a lone card on the last row across the whole row.
 */
export const useGridList = (gap: number = DEFAULT_GAP) => {
  const { width } = useBreakpoint();
  const { horizontalGutter, listMaxWidth, columns } = useReadableLayout();

  const available = Math.min(width, listMaxWidth) - horizontalGutter * 2;
  const itemWidth = (available - gap * (columns - 1)) / columns;

  return useMemo(() => {
    const contentContainerStyle: ViewStyle = {
      paddingHorizontal: horizontalGutter,
      paddingBottom: 24,
      gap,
      maxWidth: listMaxWidth,
      alignSelf: "center",
      width: "100%",
    };

    return {
      columns,
      itemWidth,
      /**
       * Pass as `key` on the `FlatList`: React Native throws when
       * `numColumns` changes on a mounted list, so rotating remounts it.
       */
      gridKey: `grid-${columns}`,
      /** Apply to each row item so the last row aligns left, not stretched. */
      itemStyle: (columns > 1
        ? { width: itemWidth }
        : { width: "100%" }) as ViewStyle,
      listProps: {
        numColumns: columns,
        columnWrapperStyle: columns > 1 ? { gap } : undefined,
        contentContainerStyle,
      },
    };
  }, [columns, itemWidth, gap, horizontalGutter, listMaxWidth]);
};
