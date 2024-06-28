import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Checkbox,
  ListItemText,
  SelectChangeEvent,
  Drawer,
} from "@mui/material";
import { useExploreContext } from "../../store/Provider";
import { AdultGenderEnum } from "src/components/StoryCreator/store/state";
import { Languages } from "src/shared/languages";
import { Morals } from "src/shared/mockedData/Moral";
import { Environments } from "src/shared/mockedData/Environments";
import { Tones } from "src/shared/mockedData/Tone";
import { ExploreStoryFilters } from "../../store/state";

import "./FiltersPanel.scss";

const FiltersPanel: React.FC = (): JSX.Element => {
  const {
    store: {
      state: { filters, isFiltersPanelOpen },
      handleUpdateFilters,
      handleClearFilters,
    },
    manager: { toggleFiltersPanel, filterStories },
  } = useExploreContext();

  const handleOnPanelClose = () => {
    toggleFiltersPanel(false);
  };

  const handleSelectChange = (event: SelectChangeEvent<string[]>) => {
    const { name, value } = event.target;
    handleUpdateFilters(name as keyof ExploreStoryFilters, value);
  };

  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    handleUpdateFilters(name as keyof ExploreStoryFilters, value);
  };

  const handleGenderChange = (
    event: React.MouseEvent<HTMLElement>,
    gender: string[]
  ) => {
    if (gender !== null) {
      handleUpdateFilters("gender", gender);
    }
  };

  const handleOnApplyFiltersClick = () => {
    filterStories();
    handleOnPanelClose();
  };

  const handleOnClearFiltersClick = () => {
    handleClearFilters();
  };

  return (
    <Drawer
      anchor="right"
      open={isFiltersPanelOpen}
      PaperProps={{
        sx: {
          width: { xs: "65%", sm: "auto" },
        },
      }}
      className="filters-panel-container"
      onClose={handleOnPanelClose}
    >
      <Box
        height="100%"
        display="flex"
        alignItems="center"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Box className="filters-form">
          <TextField
            label="Name"
            name="name"
            size="small"
            variant="outlined"
            value={filters.name}
            className="filters-form-item"
            onChange={handleFieldChange}
          />

          <FormControl className="filters-form-item">
            <InputLabel id="language-select-label">Language</InputLabel>
            <Select
              required
              multiple
              name="language"
              variant="outlined"
              label="Language"
              id="language-select"
              value={filters.language}
              labelId="language-select-label"
              renderValue={(selected) => selected.join(", ").toUpperCase()}
              onChange={handleSelectChange}
            >
              {Languages.map((language, index) => {
                return (
                  <MenuItem key={index} value={language.value}>
                    <Checkbox
                      checked={filters.language?.includes(language.value)}
                    />
                    <ListItemText primary={language.name} />
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl className="filters-form-item">
            <InputLabel id="age-select-label">Age</InputLabel>
            <Select
              multiple
              name="age"
              label="Age"
              variant="outlined"
              id="age-select"
              value={filters.age}
              labelId="filters-age-select-label"
              renderValue={(selected) => selected.join(", ")}
              onChange={handleSelectChange}
            >
              {[...Array(50).keys()].map((value) => (
                <MenuItem key={value} value={value.toString()}>
                  <Checkbox checked={filters.age.includes(value.toString())} />
                  <ListItemText primary={value + 1} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box className="filters-form-item">
            <ToggleButtonGroup
              exclusive
              value={filters.gender}
              aria-labelledby="gender-toggle"
              onChange={handleGenderChange}
            >
              <ToggleButton
                value={AdultGenderEnum.Male}
                sx={{
                  color: (theme) => theme.palette.text.primary,
                  "&.Mui-selected": {
                    backgroundColor: (theme) => theme.palette.primary.main,
                    color: (theme) => theme.palette.text.primary,
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: (theme) => theme.palette.secondary.main,
                  },
                }}
              >
                {AdultGenderEnum.Male}
              </ToggleButton>

              <ToggleButton
                value={AdultGenderEnum.Female}
                sx={{
                  color: (theme) => theme.palette.text.primary,
                  "&.Mui-selected": {
                    backgroundColor: (theme) => theme.palette.primary.main,
                    color: (theme) => theme.palette.text.primary,
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: (theme) => theme.palette.secondary.main,
                  },
                }}
              >
                {AdultGenderEnum.Female}
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <FormControl className="filters-form-item">
            <InputLabel id="nationality-select-label">Moral</InputLabel>
            <Select
              multiple
              name="moral"
              label="Moral"
              variant="outlined"
              id="filters-moral-select"
              value={filters.moral}
              labelId="filters-moral-select-label"
              renderValue={(selected) => selected.join(", ")}
              onChange={handleSelectChange}
            >
              {Morals.map((moral, index) => {
                return (
                  <MenuItem key={index} value={moral.value}>
                    <Checkbox checked={filters.moral?.includes(moral.value)} />
                    <ListItemText primary={moral.name} />
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl className="filters-form-item">
            <InputLabel id="nationality-select-label">Tone</InputLabel>
            <Select
              multiple
              name="tone"
              variant="outlined"
              label="Tone"
              id="filters-tone-select"
              value={filters.tone}
              labelId="filters-tone-select-label"
              renderValue={(selected) => selected.join(", ")}
              onChange={handleSelectChange}
            >
              {Tones.map((tone, index) => {
                return (
                  <MenuItem key={index} value={tone.value}>
                    <Checkbox checked={filters.tone?.includes(tone.value)} />
                    <ListItemText primary={tone.name} />
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl className="filters-form-item">
            <InputLabel id="nationality-select-label">Environment</InputLabel>
            <Select
              multiple
              name="environment"
              variant="outlined"
              label="Environment"
              id="environment-select"
              value={filters.environment}
              labelId="environment-select-label"
              renderValue={(selected) => selected.join(", ")}
              onChange={handleSelectChange}
            >
              {Environments.map((environment, index) => {
                return (
                  <MenuItem key={index} value={environment.value}>
                    <Checkbox
                      checked={filters.environment.includes(environment.value)}
                    />
                    <ListItemText primary={environment.name} />
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>

        <Box
          mt={2}
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          className="filters-form-footer"
          sx={{
            borderTop: (theme) => `1px solid ${theme.palette.text.primary}`,
          }}
        >
          <Button
            size="small"
            variant="text"
            color="secondary"
            onClick={handleOnPanelClose}
          >
            Cancel
          </Button>

          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Button
              sx={{ mr: 1 }}
              size="small"
              color="primary"
              variant="outlined"
              onClick={handleOnClearFiltersClick}
            >
              Clear
            </Button>

            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={handleOnApplyFiltersClick}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default FiltersPanel;
