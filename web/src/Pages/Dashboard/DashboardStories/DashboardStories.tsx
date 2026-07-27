import { Box, Typography } from "@mui/material";
import { DataGrid, GridPaginationModel } from "@mui/x-data-grid";
import {
  primaryColorOpaqueTen,
  primaryColorOpaqueThirty,
} from "src/application/shared/themes";

import { getDashboardStoriesDataGridConfig } from "./features/dataGridConfig";
import { useDashboardStoriesContext } from "./store/Provider";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { localeFromLanguage } from "@yasserzakywafaa/client-core";

const DashboardStories = () => {
  const { t, i18n } = useTranslation("dashboard");
  const locale = localeFromLanguage(i18n.language);
  const {
    store: {
      state: { isFetching, stories, paging },
    },
    manager: { setUp, handleGetStoriesByPage },
  } = useDashboardStoriesContext();

  const config = getDashboardStoriesDataGridConfig(stories, t, locale);

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    const pageNumber = model.page + 1;
    const pageSize = model.pageSize;
    handleGetStoriesByPage(pageNumber, pageSize);
  };

  useEffect(() => {
    setUp();
  }, []);

  return (
    <Box>
      <Typography variant="h4" component="h1" color="primary" gutterBottom>
        {t("stories.title")}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: "text.secondary",
          mb: 3
        }}>
        {paging.totalCount
          ? t("stories.totalCount", { count: paging.totalCount })
          : t("stories.subtitle")}
      </Typography>
      <Box sx={{ overflowX: "auto", position: "relative", width: "100%" }}>
        <DataGrid
          rows={config.rows}
          columns={config.columns}
          paginationMode="server"
          rowCount={paging.totalCount || 0}
          paginationModel={{
            page: (paging.pageNumber || 1) - 1,
            pageSize: paging.pageSize || 20,
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

export default DashboardStories;
