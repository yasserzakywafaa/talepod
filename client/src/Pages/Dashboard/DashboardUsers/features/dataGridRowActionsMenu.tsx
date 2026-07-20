import {
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { Block, Delete, Edit, MoreVert } from "@mui/icons-material";

import { GridRenderCellParams } from "@mui/x-data-grid";
import { DashboardUsersGridFields } from "./dataGridConfig";
import { primaryColor } from "src/application/shared/themes";
import { useDashboardUsersContext } from "../store/Provider";
import { useState } from "react";
import DeleteUserDialog from "./deleteUserDialog";
import { useNavigate } from "react-router-dom";
import routes from "src/application/routes";
import { useTranslation } from "react-i18next";

const DataGridRowActionsMenu = (params: GridRenderCellParams) => {
  const { t } = useTranslation("dashboard");
  const { t: tCommon } = useTranslation("common");
  const navigate = useNavigate();
  const {
    manager: { handleBlockUser, handleDeleteUser },
  } = useDashboardUsersContext();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleToggleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleOnClickViewEdit =
    (params: GridRenderCellParams<DashboardUsersGridFields>) => () => {
      navigate(routes.dashboard.viewUser(params.row.id));
      handleMenuClose();
    };

  const handleOnClickBlock =
    (params: GridRenderCellParams<DashboardUsersGridFields>) => () => {
      handleBlockUser(params.row.id);
      handleMenuClose();
    };

  const handleOnClickDelete =
    (params: GridRenderCellParams<DashboardUsersGridFields>) => () => {
      const user = params.row.user;
      setUserToDelete({
        id: params.row.id,
        name: `${user.name.givenName} ${user.name.familyName}`,
      });
      setIsDeleteDialogOpen(true);
      handleMenuClose();
    };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      handleDeleteUser(userToDelete.id);
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 1
      }}>
      <IconButton
        size="small"
        color="primary"
        sx={{
          borderRadius: "8px",
          border: `1px solid ${primaryColor}`,
        }}
        aria-haspopup="true"
        aria-controls={anchorEl ? "row-actions-menu" : undefined}
        aria-expanded={anchorEl ? "true" : undefined}
        onClick={handleToggleMenu}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="row-actions-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleToggleMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{ list: { "aria-labelledby": "row-actions-menu" } }}
      >
        <MenuItem onClick={handleOnClickViewEdit(params)}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2" sx={{ fontSize: "14px" }}>
            {t("stories.viewEdit")}
          </Typography>
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        <MenuItem onClick={handleOnClickBlock(params)}>
          <Block fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2" sx={{ fontSize: "14px" }}>
            {t("admin.users.block")}
          </Typography>
        </MenuItem>

        <MenuItem
          onClick={handleOnClickDelete(params)}
          sx={{ color: "error.main" }}
        >
          <Delete fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2" sx={{ fontSize: "14px" }}>
            {tCommon("delete")}
          </Typography>
        </MenuItem>
      </Menu>
      {userToDelete && (
        <DeleteUserDialog
          isOpen={isDeleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleConfirmDelete}
          userName={userToDelete.name}
        />
      )}
    </Box>
  );
};

export default DataGridRowActionsMenu;
