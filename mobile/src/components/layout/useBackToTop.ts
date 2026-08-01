import { useCallback, useRef, useState } from "react";
import type { FlatList, NativeScrollEvent, NativeSyntheticEvent, ScrollView } from "react-native";

/** How far down the user has to be before the button is worth offering. */
const SHOW_AFTER_PX = 400;

type Scrollable = Pick<ScrollView, "scrollTo"> | Pick<FlatList, "scrollToOffset">;

/**
 * Back-to-top for any scroll container. Returns props to spread on the list or
 * scroll view; `scrollEventThrottle` is set because iOS otherwise fires this
 * once per frame.
 */
export const useBackToTop = () => {
  const ref = useRef<Scrollable | null>(null);
  const [isVisible, setVisible] = useState(false);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = event.nativeEvent.contentOffset.y;
      setVisible((wasVisible) =>
        wasVisible === y > SHOW_AFTER_PX ? wasVisible : y > SHOW_AFTER_PX,
      );
    },
    [],
  );

  const scrollToTop = useCallback(() => {
    const target = ref.current;
    if (!target) return;
    if ("scrollToOffset" in target) {
      target.scrollToOffset({ offset: 0, animated: true });
    } else {
      target.scrollTo({ y: 0, animated: true });
    }
  }, []);

  return {
    ref,
    isVisible,
    scrollToTop,
    scrollProps: { onScroll, scrollEventThrottle: 16 },
  };
};
