import { AutoFixHighOutlined, FilterAltOffOutlined } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import NoResultsFound from "src/components/shared/NoResults/NoResults";

interface NoStoriesFoundProps {
  handleOnCreateClick: () => void;
  handleClearFilters: () => void;
}

const NoStoriesFound = (props: NoStoriesFoundProps) => {
  const { handleOnCreateClick, handleClearFilters } = props;

  return (
    <>
      <NoResultsFound />

      <Box width="100%" margin="auto" display="flex" justifyContent="center">
        <Button
          size="large"
          color="secondary"
          variant="contained"
          sx={{ my: 2, mx: 1, px: 2 }}
          endIcon={<AutoFixHighOutlined />}
          onClick={handleOnCreateClick}
        >
          Create Story
        </Button>

        <Button
          size="large"
          color="primary"
          variant="outlined"
          sx={{ my: 2, mx: 1, px: 2 }}
          endIcon={<FilterAltOffOutlined />}
          onClick={handleClearFilters}
        >
          Clear Filters
        </Button>
      </Box>
    </>
  );
};

export default NoStoriesFound;
