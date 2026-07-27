import "./NotFound.scss";

import { Box, Button, Typography } from "@mui/material";

import BunnyNotFound from "../../assets/images/not_found_404/confused_bunny_with_magnifier.webp";
import { HomeOutlined } from "@mui/icons-material";
import Page from "src/components/shared/Page/Page";
import { routes } from "src/application/routes";
import { localizedPath } from "@yasserzakywafaa/client-core/web/i18n";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NotFoundPage = () => {
  const { t, i18n } = useTranslation("page");
  const navigate = useNavigate();
  const handleOnClick = () =>
    navigate(localizedPath(routes.features, i18n.language));

  return (
    <>
      <Box component="div" className="not-found-page">
        <Page title={t("notFound.pageTitle")} noIndex>
          <Box
            component="div"
            className="not-found-card-wrapper "
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "center",
              p: 3
            }}>
            <Box component="div" className="not-found-image">
              <img src={BunnyNotFound} width="100%" />
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
                {t("notFound.title")}
              </Typography>

              <Button
                sx={{ marginY: "2rem" }}
                size="large"
                type="button"
                variant="contained"
                endIcon={<HomeOutlined />}
                onClick={handleOnClick}
              >
                {t("notFound.goToMain")}
              </Button>
            </Box>
          </Box>
        </Page>
      </Box>
    </>
  );
};

export default NotFoundPage;
