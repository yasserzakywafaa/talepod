import "./SwipeToRefresh.scss";

import {
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
  RefreshOutlined,
} from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

import useSwipeToRefresh from "src/shared/hooks/useSwipeToRefresh";

export interface SwipeToRefreshProps {
  threshold?: number;
  onRefresh?: () => Promise<void>;
}

const SwipeToRefresh = (params: SwipeToRefreshProps) => {
  const { threshold, onRefresh } = params;
  const swipeDownThreshold = threshold || 75;

  const { isRefreshing, swipeDistance } = useSwipeToRefresh({
    threshold: swipeDownThreshold,
    onRefresh: onRefresh,
  });

  return (
    <Box
      className={`swipe-to-refresh ${
        swipeDistance > 0 && !isRefreshing ? "visible" : ""
      }`}
    >
      {swipeDistance >= swipeDownThreshold ? (
        <>
          <Box display="flex" justifyContent="center" alignItems="center">
            <ArrowUpwardOutlined
              color="primary"
              fontSize="medium"
              sx={{ mr: 1 }}
            />
            <Typography color="text.primary">Release to refresh</Typography>
            <RefreshOutlined color="primary" fontSize="medium" sx={{ ml: 1 }} />
          </Box>
        </>
      ) : (
        <>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            color="primary"
          >
            <ArrowDownwardOutlined
              color="primary"
              fontSize="medium"
              sx={{ mr: 1 }}
            />
            <Typography color="text.primary">Pull to refresh</Typography>
            <RefreshOutlined color="primary" fontSize="medium" sx={{ ml: 1 }} />
          </Box>
        </>
      )}
    </Box>
  );
};

export default SwipeToRefresh;
