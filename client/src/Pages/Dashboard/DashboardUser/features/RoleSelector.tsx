import {
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { User, UserRole } from "src/shared/types/user";

import { AdminPanelSettings as AdminPanelSettingsIcon } from "@mui/icons-material";
import { useState } from "react";

interface RoleSelectorProps {
  user: User | null;
  onRoleChange: (userId: string, role: UserRole) => Promise<void>;
}

const RoleSelector = ({ user, onRoleChange }: RoleSelectorProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!user) {
    return null;
  }

  const handleRoleChange = async (event: SelectChangeEvent) => {
    const newRole = event.target.value as UserRole;
    if (newRole === user.role) {
      return;
    }

    setIsUpdating(true);
    try {
      await onRoleChange(user._id, newRole);
    } catch (error) {
      console.error("Failed to update role:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.super_admin:
        return "Super Admin";
      case UserRole.admin:
        return "Admin";
      case UserRole.user:
        return "User";
      default:
        return role;
    }
  };

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2
          }}>
          <AdminPanelSettingsIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">User Role</Typography>
        </Box>
        <FormControl fullWidth>
          <InputLabel id="role-select-label">Role</InputLabel>
          <Select
            labelId="role-select-label"
            id="role-select"
            value={user.role}
            label="Role"
            onChange={handleRoleChange}
            disabled={isUpdating}
          >
            {Object.values(UserRole).map((role) => (
              <MenuItem key={role} value={role}>
                {getRoleLabel(role)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            mt: 1
          }}>
          Change the user's role to control their permissions and access level.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default RoleSelector;
