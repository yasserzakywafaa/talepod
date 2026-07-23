import { Box, Button, Typography } from "@mui/material";

import BunnyNoStoryFound from "../../../assets/images/sad_bunny_with_book_and_cloud.webp";
import { SearchOutlined } from "@mui/icons-material";
import { routes } from "src/application/routes";
import { localizedPath } from "@yasserzakywafaa/client-core/web/i18n";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const StoryNotFound: React.FC = () => {
  const { t, i18n } = useTranslation("story");
  const navigate = useNavigate();
  const handleOnClick = () =>
    navigate(localizedPath(routes.features, i18n.language));

  return (
    <>
      <Box component="div" className="no-results-container" sx={{
        width: "100%"
      }}>
        <Box
          component="div"
          className="no-results-wrapper "
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
            p: 3
          }}>
          <Box component="div" className="no-results-image">
            <img src={BunnyNoStoryFound} width="100%" />
          </Box>

          <Box
            component="div"
            className="unauthorized-card-wrapper"
            sx={{
              marginY: 4,
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "center"
            }}>
            <Typography variant="h5" sx={{
              textAlign: "center"
            }}>
              {t("reader.notFound")}
            </Typography>

            <Button
              sx={{ marginY: "2rem" }}
              size="large"
              type="button"
              variant="outlined"
              endIcon={<SearchOutlined />}
              onClick={handleOnClick}
            >
              {t("reader.browseLibrary")}
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default StoryNotFound;
