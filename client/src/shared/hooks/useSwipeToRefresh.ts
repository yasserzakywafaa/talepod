import { useEffect, useRef, useState } from "react";

export interface SwipeToRefreshProps {
  threshold?: number;
  onRefresh?: () => Promise<void>;
}

const useSwipeToRefresh = (props: SwipeToRefreshProps) => {
  //   const maxThreshold = 200;
  const { threshold = 100, onRefresh } = props;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [swipeDistance, setSwipeDistance] = useState(0);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: TouchEvent) => {
    // Only start tracking if the scroll position is at the top
    if (window.scrollY === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (touchStartY.current !== null) {
      const currentY = e.touches[0].clientY;
      const distance = currentY - touchStartY.current;
      if (distance > 0) {
        setSwipeDistance(distance);
      }
    }
  };

  const handleTouchEnd = async () => {
    if (swipeDistance >= threshold) {
      setIsRefreshing(true);
      if (onRefresh) await onRefresh();

      if (!onRefresh && swipeDistance > threshold) {
        window.location.reload();
      }
      setIsRefreshing(false);
    }
    setSwipeDistance(0);
    touchStartY.current = null;
  };

  useEffect(() => {
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [swipeDistance]);

  return { isRefreshing, swipeDistance };
};

export default useSwipeToRefresh;
