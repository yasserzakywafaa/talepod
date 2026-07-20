import { AutoFixHighOutlined, FilterAltOffOutlined } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import NoResultsFound from "src/components/shared/NoResults/NoResults";
import { useTranslation } from "react-i18next";

interface NoStoriesFoundProps {
  handleOnCreateClick: () => void;
  handleClearFilters: () => void;
}

const NoStoriesFound = (props: NoStoriesFoundProps) => {
  const { t } = useTranslation("library");
  const { handleOnCreateClick, handleClearFilters } = props;

  return (
    <>
      <NoResultsFound />
      <Box
        sx={{
          width: "100%",
          margin: "auto",
          display: "flex",
          justifyContent: "center"
        }}>
        <Button
          size="large"
          color="secondary"
          variant="contained"
          sx={{ my: 2, mx: 1, px: 2 }}
          endIcon={<AutoFixHighOutlined />}
          onClick={handleOnCreateClick}
        >
          {t("page.emptyCreate")}
        </Button>

        <Button
          size="large"
          color="primary"
          variant="outlined"
          sx={{ my: 2, mx: 1, px: 2 }}
          endIcon={<FilterAltOffOutlined />}
          onClick={handleClearFilters}
        >
          {t("page.emptyClearFilters")}
        </Button>
      </Box>
    </>
  );
};

export default NoStoriesFound;
