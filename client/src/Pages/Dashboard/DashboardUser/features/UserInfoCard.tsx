import { Box, Card, CardContent, Chip, Grid, Typography } from "@mui/material";
import { User, UserRole, UserStatus } from "src/shared/types/user";

import ProfileAvatar from "src/components/shared/ProfileAvatar";
import { getUserContact } from "src/shared/utils/getUserContact";
import { useTranslation } from "react-i18next";
import {
  formatLocalizedDateTime,
  localeFromLanguage,
} from "@yasserzakywafaa/client-core";

interface UserInfoCardProps {
  user: User | null;
}

const UserInfoCard = ({ user }: UserInfoCardProps) => {
  const { t, i18n } = useTranslation("dashboard");
  const locale = localeFromLanguage(i18n.language);

  if (!user) {
    return null;
  }

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case UserStatus.active:
        return "success";
      case UserStatus.inactive:
        return "default";
      case UserStatus.suspended:
        return "warning";
      case UserStatus.banned:
        return "error";
      default:
        return "default";
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.super_admin:
        return t("admin.users.roleSuperAdmin");
      case UserRole.admin:
        return t("admin.users.roleAdmin");
      case UserRole.user:
        return t("admin.user.roleUser");
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
            gap: 3,
            justifyContent: "space-between",
            flexWrap: "wrap"
          }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2
            }}>
            <ProfileAvatar
              user={user}
              avatarSize={{ width: 80, height: 80 }}
              verifiedBadgeSize={16}
            />
            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                {user.name.givenName} {user.name.familyName}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  mb: 1
                }}>
                <Chip
                  label={t(`admin.users.statusValues.${user.status}`)}
                  color={getStatusColor(user.status) as any}
                  size="small"
                />
                <Chip
                  label={getRoleLabel(user.role)}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              </Box>
              <Typography variant="body2" sx={{
                fontWeight: "bold"
              }}>
                {getUserContact(user)}
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={1}>
            <Grid container size={{ xs: 12 }} sx={{
              gap: 2
            }}>
              <Grid size={{ xs: 3, sm: 2 }}>
                <Typography variant="body2">{t("admin.user.userId")}</Typography>
              </Grid>
              <Grid size="auto">
                <Typography variant="body2" sx={{
                  fontWeight: "bold"
                }}>
                  {user.userId}
                </Typography>
              </Grid>
            </Grid>

            <Grid container size={{ xs: 12 }} sx={{
              gap: 2
            }}>
              <Grid size={{ xs: 3, sm: 2 }}>
                <Typography variant="body2">{t("admin.user.created")}</Typography>
              </Grid>
              <Grid size="auto">
                <Typography variant="body2" sx={{
                  fontWeight: "bold"
                }}>
                  {formatLocalizedDateTime(user.createdAt, locale)}
                </Typography>
              </Grid>
            </Grid>

            <Grid container size={{ xs: 12 }} sx={{
              gap: 2
            }}>
              <Grid size={{ xs: 3, sm: 2 }}>
                <Typography variant="body2">{t("admin.user.lastLogin")}</Typography>
              </Grid>
              <Grid size="auto">
                <Typography variant="body2" sx={{
                  fontWeight: "bold"
                }}>
                  {formatLocalizedDateTime(user.lastLogin, locale)}
                </Typography>
              </Grid>
            </Grid>

            <Grid container size={{ xs: 12 }} sx={{
              gap: 2
            }}>
              <Grid size={{ xs: 3, sm: 2 }}>
                <Typography variant="body2">{t("admin.user.subscription")}</Typography>
              </Grid>
              <Grid size="auto">
                <Typography variant="body2" sx={{
                  fontWeight: "bold"
                }}>
                  {user.subscription?.type || t("admin.user.notAvailable")}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;
