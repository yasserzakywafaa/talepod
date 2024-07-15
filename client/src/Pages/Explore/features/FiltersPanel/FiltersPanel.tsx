import "./FiltersPanel.scss";

import {
  Box,
  Button,
  Checkbox,
  Drawer,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

import { AdultGenderEnum } from "src/components/StoryCreator/store/state";
import { Environments } from "src/shared/mockedData/Environments";
import { ExploreStoryFilters } from "../../store/state";
import { Languages } from "src/shared/languages";
import { Morals } from "src/shared/mockedData/Moral";
import { Tones } from "src/shared/mockedData/Tone";
import { hasCensoredWords } from "src/shared/utils/censoredWords/getAllCensoredWords";
import { useExploreContext } from "../../store/Provider";

const FiltersPanel: React.FC = (): JSX.Element => {
  const {
    store: {
      state: { filters, isFiltersPanelOpen },
    },
    manager: {
      handleToggleFiltersPanel,
      handleUpdateFilters,
      handleFilterStories,
      handleClearFilters,
    },
  } = useExploreContext();

  const handleOnPanelClose = () => {
    handleToggleFiltersPanel(false);
  };

  const handleOnCancelClick = () => {
    handleOnPanelClose();
  };

  const handleSelectChange = (event: SelectChangeEvent<string[]>) => {
    const { name, value } = event.target;
    handleUpdateFilters(name as keyof ExploreStoryFilters, value);
  };

  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    handleUpdateFilters(name as keyof ExploreStoryFilters, value);
  };

  const handleAudioCheckboxChange = (
    event: React.SyntheticEvent<Element, Event>,
    checked: boolean
  ) => {
    handleUpdateFilters("audio", checked ? true : undefined);
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
    handleFilterStories();
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
          width: { xs: "60%", sm: "35%", lg: "auto" },
        },
      }}
      className="filters-panel-container"
      onClose={handleOnPanelClose}
    >
      <Box textAlign="center" mt="1rem">
        <Typography variant="h5" color="primary">
          Filter Stories
        </Typography>
      </Box>

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
            error={hasCensoredWords(filters.name!)}
            helperText={hasCensoredWords(filters.name!) && "Not Appropriate 🙈"}
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
                  <MenuItem
                    key={index}
                    value={language.value}
                    className="select-menu-item"
                  >
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
                <MenuItem
                  key={value}
                  value={(value + 1).toString()}
                  className="select-menu-item"
                >
                  <Checkbox
                    checked={filters.age.includes((value + 1).toString())}
                  />
                  <ListItemText primary={value + 1} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box
            width="100%"
            display="flex"
            alignItems={{ xs: "start", sm: "center" }}
            className="filters-form-item"
            flexDirection={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
          >
            <ToggleButtonGroup
              exclusive
              sx={{ mb: { xs: 1 }, width: { xs: "100%", sm: "auto" } }}
              value={filters.gender}
              aria-labelledby="gender-toggle"
              onChange={handleGenderChange}
            >
              <ToggleButton
                value={AdultGenderEnum.Male}
                sx={{
                  color: (theme) => theme.palette.text.primary,
                  borderColor: "divider",
                  width: { xs: "50%" },
                  "&.Mui-selected": {
                    backgroundColor: (theme) => theme.palette.primary.main,
                    color: (theme) => theme.palette.text.primary,
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: (theme) => theme.palette.primary.main,
                  },
                }}
              >
                {AdultGenderEnum.Male}
              </ToggleButton>

              <ToggleButton
                value={AdultGenderEnum.Female}
                sx={{
                  color: (theme) => theme.palette.text.primary,
                  borderColor: "divider",
                  width: { xs: "50%" },
                  "&.Mui-selected": {
                    backgroundColor: (theme) => theme.palette.primary.main,
                    color: (theme) => theme.palette.text.primary,
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: (theme) => theme.palette.primary.main,
                  },
                }}
              >
                {AdultGenderEnum.Female}
              </ToggleButton>
            </ToggleButtonGroup>

            <FormGroup>
              <FormControlLabel
                name="audio"
                label="Story audio"
                checked={filters.audio}
                control={<Checkbox />}
                onChange={handleAudioCheckboxChange}
              />
            </FormGroup>
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
                  <MenuItem
                    key={index}
                    value={moral.value}
                    className="select-menu-item"
                  >
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
                  <MenuItem
                    key={index}
                    value={tone.value}
                    className="select-menu-item"
                  >
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
                  <MenuItem
                    key={index}
                    value={environment.value}
                    className="select-menu-item"
                  >
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
            onClick={handleOnCancelClick}
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
