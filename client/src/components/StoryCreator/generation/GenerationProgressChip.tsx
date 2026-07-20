import {
  Box,
  Button,
  CircularProgress,
  Snackbar,
  SnackbarContent,
  Typography,
} from "@mui/material";
import { ErrorOutlineOutlined, MenuBookOutlined } from "@mui/icons-material";

import routes from "src/application/routes";
import { useGenerationContext } from "./Provider";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

/**
 * App-global, non-blocking progress chip for the active story generation. Uses
 * an MUI Snackbar (docked bottom-right) so the user can keep browsing while the
 * story is created, then offers a "View story" action when ready (and a dismiss
 * on ready/failed). It reads the GenerationContext and is mounted once, inside
 * the router.
 */
const GenerationProgressChip = () => {
  const { t } = useTranslation("story");
  const navigate = useNavigate();
  const {
    store: { job },
    manager: { dismissGeneration },
  } = useGenerationContext();

  const formatLabel =
    job?.format === "comic"
      ? t("generating.chip.formatComic")
      : t("generating.chip.formatStory");

  const handleView = () => {
    if (job?.navUrl) navigate(job.navUrl);
    dismissGeneration();
  };

  const renderContent = () => {
    if (!job) return null;

    if (job.textStatus === "ready") {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="subtitle2" noWrap>
            {job.childName
              ? t("generating.chip.readyNamed", {
                  name: job.childName,
                  format: formatLabel,
                })
              : t("generating.chip.readyGeneric")}
          </Typography>

          <Button
            size="small"
            variant="contained"
            onClick={handleView}
            endIcon={<MenuBookOutlined />}
          >
            {t("generating.chip.viewStory")}
          </Button>
        </Box>
      );
    }

    if (job.textStatus === "failed") {
      return (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="subtitle2">
              {t("generating.chip.failedTitle")}
            </Typography>

            <ErrorOutlineOutlined color="error" />
          </Box>
          <Typography variant="caption" sx={{
            color: "text.secondary"
          }}>
            {t("generating.chip.failedHint")}
          </Typography>
        </>
      );
    }

    return (
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="subtitle2" noWrap>
            {job.childName
              ? t("generating.chip.creatingNamed", {
                  name: job.childName,
                  format: formatLabel,
                })
              : t("generating.chip.creatingGeneric", { format: formatLabel })}
          </Typography>

          <CircularProgress size={24} color="primary" />
        </Box>
        <Typography variant="caption" sx={{
          color: "text.secondary"
        }}>
          {t("generating.chip.visitLibrary")}
          <Button
            size="small"
            component="a"
            href={routes.library}
            variant="text"
            onClick={(e) => {
              e.preventDefault();
              navigate(routes.library);
            }}
            sx={{
              minWidth: 0,
              p: 0,
              ml: 0.5,
              verticalAlign: "baseline",
              textDecoration: "underline",
              textTransform: "none",
            }}
          >
            {t("generating.chip.libraryLink")}
          </Button>{" "}
          {t("generating.chip.visitLibrarySuffix")}
        </Typography>
      </>
    );
  };

  return (
    <Snackbar
      open={!!job}
      color="info"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      // A pending generation never auto-hides; ready/failed are dismissed by
      // the user (or by clicking "View story").
      sx={{
        bottom: "1rem",
        left: "1rem",
        maxWidth: 360,
        width: { xs: "75%", sm: 360 },
        "& .MuiPaper-root": { padding: "0.5rem" },
        "& .MuiSnackbarContent-root": {
          backgroundColor: "primary.contrastText",
          color: "primary.main",
        },
      }}
    >
      <SnackbarContent
        message={renderContent()}
        sx={{
          "& .MuiSnackbarContent-message": { width: "100%" },
        }}
      />
    </Snackbar>
  );
};

export default GenerationProgressChip;
