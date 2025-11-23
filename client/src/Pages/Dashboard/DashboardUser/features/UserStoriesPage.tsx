import { Box, Typography } from "@mui/material";
import { DataGrid, GridPaginationModel } from "@mui/x-data-grid";
import axios, { AxiosResponse } from "axios";
import {
  primaryColorOpaqueTen,
  primaryColorOpaqueThirty,
} from "src/application/shared/themes";

import { ApiResponseWithPaging } from "src/shared/types/types";
import END_POINTS from "src/application/shared/endpoints";
import { Story } from "src/components/StoryCreator/store/state";
import { getDashboardStoriesDataGridConfig } from "../../DashboardStories/features/dataGridConfig";
import { useDashboardUserContext } from "../store/Provider";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";

const UserStoriesPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const {
    store: {
      state: { user },
    },
    manager: { setUp },
  } = useDashboardUserContext();
  const [isFetching, setIsFetching] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [paging, setPaging] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
  });

  const config = getDashboardStoriesDataGridConfig(stories);

  const handleGetStoriesByPage = async (
    pageNumber: number = 1,
    pageSize: number = 10
  ) => {
    if (!userId) return;

    setIsFetching(true);
    try {
      const response: AxiosResponse<ApiResponseWithPaging<Story[]>> =
        await axios.get(END_POINTS.STORIES.GET_ALL_USER_STORIES, {
          params: {
            userId,
            pageNumber,
            pageSize,
            hasActiveFilters: false,
            filters: JSON.stringify({}),
          },
        });

      setStories(response.data.results as Story[]);
      setPaging({
        pageNumber: response.data.paging.pageNumber,
        pageSize,
        totalCount: response.data.paging.totalCount ?? 0,
      });
    } catch (error) {
      console.error("❌ Failed to get user stories:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    const pageNumber = model.page + 1;
    const pageSize = model.pageSize;
    handleGetStoriesByPage(pageNumber, pageSize);
  };

  useEffect(() => {
    if (userId) {
      setUp(userId);
      handleGetStoriesByPage();
    }
  }, [userId]);

  return (
    <Box>
      <Typography variant="h4" component="h1" color="primary" gutterBottom>
        {user?.name.givenName} {user?.name.familyName}'s Stories
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {paging.totalCount
          ? `${paging.totalCount} total stories`
          : "No stories found for this user."}
      </Typography>

      <Box sx={{ overflowX: "auto", position: "relative", width: "100%" }}>
        <DataGrid
          rows={config.rows}
          columns={config.columns}
          paginationMode="server"
          rowCount={paging.totalCount || 0}
          paginationModel={{
            page: (paging.pageNumber || 1) - 1,
            pageSize: paging.pageSize || 10,
          }}
          onPaginationModelChange={handlePaginationModelChange}
          pageSizeOptions={[10, 20, 50, 100]}
          disableRowSelectionOnClick
          disableAutosize
          disableColumnResize
          loading={isFetching}
          sx={{
            "& .MuiDataGrid-row:nth-of-type(odd)": {
              backgroundColor: primaryColorOpaqueTen,
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: primaryColorOpaqueThirty,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default UserStoriesPage;
