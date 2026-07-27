import { Box, Typography } from "@mui/material";
import { DataGrid, GridPaginationModel } from "@mui/x-data-grid";
import {
  primaryColorOpaqueTen,
  primaryColorOpaqueThirty,
} from "src/application/shared/themes";

import { getDashboardUsersDataGridConfig } from "./features/dataGridConfig";
import { useEffect } from "react";
import { useDashboardUsersContext } from "./store/Provider";
import { useTranslation } from "react-i18next";
import { localeFromLanguage } from "@yasserzakywafaa/client-core";

const DashboardUsers = () => {
  const { t, i18n } = useTranslation("dashboard");
  const locale = localeFromLanguage(i18n.language);
  const {
    store: {
      state: { isFetching, users, paging },
    },
    manager: { setUp, handleGetUsersByPage },
  } = useDashboardUsersContext();

  const config = getDashboardUsersDataGridConfig(users, t, locale);

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    const pageNumber = model.page + 1;
    const pageSize = model.pageSize;
    handleGetUsersByPage(pageNumber, pageSize);
  };

  useEffect(() => {
    setUp();
  }, []);

  return (
    <Box>
      <Typography variant="h4" component="h1" color="primary" gutterBottom>
        {t("admin.users.title")}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: "text.secondary",
          mb: 3
        }}>
        {paging.totalCount
          ? t("stories.totalCount", { count: paging.totalCount })
          : t("admin.users.subtitle")}
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

export default DashboardUsers;
