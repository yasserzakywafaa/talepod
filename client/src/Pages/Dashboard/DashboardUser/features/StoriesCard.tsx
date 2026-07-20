import {
  ArrowForward as ArrowForwardIcon,
  Article as ArticleIcon,
} from "@mui/icons-material";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";

import routes from "src/application/routes";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface StoriesCardProps {
  storiesCount: number;
  userId: string;
}

const StoriesCard = ({ storiesCount, userId }: StoriesCardProps) => {
  const { t } = useTranslation("dashboard");
  const navigate = useNavigate();

  const handleViewStories = () => {
    navigate(routes.dashboard.viewUserStories(userId));
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
      }}
    >
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2
          }}>
          <ArticleIcon color="primary" sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h6">{t("stories.title")}</Typography>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2
          }}>
          <Typography variant="h3" color="primary" sx={{
            fontWeight: "bold"
          }}>
            {storiesCount}
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            mb: 2,
            textAlign: "center"
          }}>
          {t("admin.user.storiesCreated", { count: storiesCount })}
        </Typography>
        <Button
          variant="contained"
          fullWidth
          endIcon={<ArrowForwardIcon />}
          onClick={handleViewStories}
          disabled={storiesCount === 0}
        >
          {t("admin.user.viewStories")}
        </Button>
      </CardContent>
    </Card>
  );
};

export default StoriesCard;
