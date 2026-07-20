import { Box, Chip, Typography } from "@mui/material";
import { User, UserRole, UserStatus } from "src/shared/types/user";

import DataGridRowActionsMenu from "./dataGridRowActionsMenu";
import { GridColDef } from "@mui/x-data-grid";
import ProfileAvatar from "src/components/shared/ProfileAvatar";
import { formatLocalizedDate } from "@yasserzakywafaa/client-core";
import { getUserContact } from "src/shared/utils/getUserContact";

export interface DashboardUsersGridFields {
  id: string;
  user: User;
  contact: string;
  type: UserRole;
  stories: number;
  joinDate: string;
  status: UserStatus;
}

export interface DashboardUsersGridResult {
  rows: DashboardUsersGridFields[];
  columns: GridColDef<DashboardUsersGridFields>[];
}

export const getUserTypeColor = (role: UserRole) => {
  switch (role) {
    case UserRole.super_admin:
    case UserRole.admin:
      return "warning";
    case UserRole.user:
      return "info";
    default:
      return "default";
  }
};

export const getUserTypeLabel = (
  role: UserRole,
  t: (key: string) => string,
) => {
  switch (role) {
    case UserRole.super_admin:
      return t("admin.users.roleSuperAdmin");
    case UserRole.admin:
      return t("admin.users.roleAdmin");
    case UserRole.user:
      return t("admin.users.roleRegular");
    default:
      return role;
  }
};

export const getUserStatusColor = (status: UserStatus) => {
  switch (status) {
    case UserStatus.active:
      return "success";
    case UserStatus.inactive:
      return "default";
    case UserStatus.suspended:
      return "error";
    case UserStatus.banned:
      return "error";
    default:
      return "default";
  }
};

export const getDashboardUsersDataGridConfig = (
  users: User[],
  t: (key: string) => string,
  locale: string,
): DashboardUsersGridResult => {
  if (!users || users.length === 0) return { rows: [], columns: [] };

  const rows: DashboardUsersGridFields[] = users.map((user) => {
    return {
      id: user._id || "",
      user: user,
      contact: getUserContact(user),
      type: user.role || UserRole.user,
      stories: user.storyCount || 0,
      joinDate: formatLocalizedDate(user.createdAt || new Date(), locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      status: user.status || UserStatus.inactive,
    };
  });

  const columns: GridColDef<(typeof rows)[number]>[] = [
    {
      field: "user",
      headerName: t("admin.users.columnUser"),
      editable: false,
      sortable: true,
      minWidth: 250,
      flex: 1,
      description: t("admin.users.columnUserDescription"),
      valueGetter: (value, row) => {
        const { givenName = "", familyName = "" } = row.user.name;
        return `${givenName} ${familyName}`.trim();
      },
      renderCell: (params) => {
        const user = params.row.user;
        const userId = user.userId || user._id || "";
        const displayId =
          userId.length > 8
            ? `#${userId.slice(-6).toUpperCase()}`
            : `#${userId.toUpperCase()}`;

        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 1.5,
              height: "100%"
            }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
              <ProfileAvatar
                user={user}
                avatarSize={{ width: 32, height: 32 }}
                verifiedBadgeSize={12}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "100%"
              }}>
              <Typography variant="body2" sx={{
                fontWeight: "medium"
              }}>
                {user.name.givenName} {user.name.familyName}
              </Typography>
              <Typography variant="caption" sx={{
                color: "text.secondary"
              }}>
                {t("stories.idLabel")} {displayId}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      field: "contact",
      headerName: t("admin.users.columnContact"),
      editable: false,
      sortable: true,
      minWidth: 200,
      flex: 1,
      display: "flex",
      description: t("admin.users.columnContactDescription"),
      renderCell: (params) => (
        <Typography variant="body2">{params.row.contact}</Typography>
      ),
    },
    {
      field: "type",
      headerName: t("admin.users.columnType"),
      editable: false,
      sortable: true,
      minWidth: 120,
      flex: 1,
      display: "flex",
      description: t("admin.users.columnTypeDescription"),
      renderCell: (params) => (
        <Chip
          label={getUserTypeLabel(params.row.type, t)}
          color={getUserTypeColor(params.row.type) as any}
          size="small"
        />
      ),
    },
    {
      field: "stories",
      headerName: t("admin.users.columnStories"),
      editable: false,
      sortable: true,
      minWidth: 100,
      flex: 1,
      display: "flex",
      description: t("admin.users.columnStoriesDescription"),
    },
    {
      field: "joinDate",
      headerName: t("admin.users.columnJoinDate"),
      editable: false,
      sortable: true,
      minWidth: 120,
      flex: 1,
      display: "flex",
      description: t("admin.users.columnJoinDateDescription"),
    },
    {
      field: "status",
      headerName: t("admin.users.columnStatus"),
      editable: false,
      sortable: true,
      minWidth: 120,
      flex: 1,
      display: "flex",
      description: t("admin.users.columnStatusDescription"),
      renderCell: (params) => (
        <Chip
          label={t(`admin.users.statusValues.${params.row.status}`)}
          color={getUserStatusColor(params.row.status) as any}
          size="small"
        />
      ),
    },
    {
      field: "action",
      align: "right",
      type: "actions",
      headerName: t("admin.users.columnActions"),
      headerAlign: "right",
      flex: 1,
      minWidth: 100,
      editable: false,
      sortable: false,
      resizable: false,
      renderCell: (params) => <DataGridRowActionsMenu {...params} />,
    },
  ];

  return {
    rows,
    columns,
  };
};
