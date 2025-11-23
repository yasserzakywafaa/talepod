import {
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { Delete, MoreVert, Visibility } from "@mui/icons-material";

import { DashboardStoriesGridFields } from "./dataGridConfig";
import DeleteStoryDialog from "./deleteStoryDialog";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { primaryColor } from "src/application/shared/themes";
import routes from "src/application/routes";
import { useDashboardStoriesContext } from "../store/Provider";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const DataGridRowActionsMenu = (params: GridRenderCellParams) => {
  const navigate = useNavigate();
  const {
    manager: { handleDeleteStory },
  } = useDashboardStoriesContext();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleToggleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleOnClickView =
    (params: GridRenderCellParams<DashboardStoriesGridFields>) => () => {
      // TODO: Navigate to view blog page
      navigate(routes.story(params.row.story.slug));
      handleMenuClose();
    };

  const handleOnClickDelete =
    (params: GridRenderCellParams<DashboardStoriesGridFields>) => () => {
      setStoryToDelete({
        id: params.row.id,
        title: params.row.title,
      });
      setIsDeleteDialogOpen(true);
      handleMenuClose();
    };

  const handleConfirmDelete = () => {
    if (storyToDelete) {
      handleDeleteStory(storyToDelete.id);
      setIsDeleteDialogOpen(false);
      setStoryToDelete(null);
    }
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setStoryToDelete(null);
  };

  return (
    <Box display="flex" justifyContent="flex-end" alignItems="center" gap={1}>
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
      >
        <MenuItem onClick={handleOnClickView(params)}>
          <Visibility fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2" sx={{ fontSize: "14px" }}>
            View
          </Typography>
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        <MenuItem
          onClick={handleOnClickDelete(params)}
          sx={{ color: "error.main" }}
        >
          <Delete fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2" sx={{ fontSize: "14px" }}>
            Delete
          </Typography>
        </MenuItem>
      </Menu>

      {storyToDelete && (
        <DeleteStoryDialog
          isOpen={isDeleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleConfirmDelete}
          storyTitle={storyToDelete.title}
        />
      )}
    </Box>
  );
};

export default DataGridRowActionsMenu;
