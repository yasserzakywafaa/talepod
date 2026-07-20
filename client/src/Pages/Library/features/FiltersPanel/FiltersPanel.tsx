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
import { LibraryStoryFilters } from "../../store/state";
import { Languages } from "src/shared/languages";
import { Morals } from "src/shared/mockedData/Moral";
import { Tones } from "src/shared/mockedData/Tone";
import { hasCensoredWords } from "src/shared/utils/censoredWords/getAllCensoredWords";
import { useLibraryContext } from "../../store/Provider";
import { trackEvent } from "src/shared/utils/ga4";
import { useTranslation } from "react-i18next";

const FiltersPanel: React.FC = (): JSX.Element => {
  const { t } = useTranslation("library");
  const { t: tStory } = useTranslation("story");
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
  } = useLibraryContext();

  const handleOnPanelClose = () => {
    handleToggleFiltersPanel(false);
  };

  const handleOnCancelClick = () => {
    handleOnPanelClose();
  };

  const handleSelectChange = (event: SelectChangeEvent<string[]>) => {
    const { name, value } = event.target;
    handleUpdateFilters(name as keyof LibraryStoryFilters, value);
  };

  const handleAgeSelectChange = (event: SelectChangeEvent<string[]>) => {
    const { name, value } = event.target;
    const values = Array.isArray(value) ? value : [value];
    const updatedValue = values.map((v) => parseInt(v, 10));
    handleUpdateFilters(
      name as keyof LibraryStoryFilters,
      updatedValue as LibraryStoryFilters[keyof LibraryStoryFilters],
    );
  };

  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    handleUpdateFilters(name as keyof LibraryStoryFilters, value);
  };

  const handleAudioCheckboxChange = (
    _event: React.SyntheticEvent<Element, Event>,
    checked: boolean,
  ) => {
    handleUpdateFilters("audio", checked ? true : undefined);
  };

  const handleGenderChange = (
    _event: React.MouseEvent<HTMLElement>,
    gender: string,
  ) => {
    if (gender !== null) {
      handleUpdateFilters("gender", gender);
    }
  };

  const handleOnApplyFiltersClick = () => {
    trackEvent("library_filter_apply", {
      active_filter_count: Object.values(filters).filter(Boolean).length,
    });
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
      <Box
        sx={{
          textAlign: "center",
          mt: "1rem"
        }}>
        <Typography variant="h5" color="primary">
          {t("filters.title")}
        </Typography>
      </Box>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
        <Box className="filters-form">
          <TextField
            label={t("filters.name")}
            name="name"
            size="small"
            variant="outlined"
            value={filters.name}
            className="filters-form-item"
            error={hasCensoredWords(filters.name || "")}
            helperText={
              hasCensoredWords(filters.name || "") && t("filters.notAppropriate")
            }
            onChange={handleFieldChange}
          />

          <FormControl className="filters-form-item">
            <InputLabel id="language-select-label">
              {t("filters.language")}
            </InputLabel>
            <Select<string[]>
              required
              multiple
              name="language"
              variant="outlined"
              label={t("filters.language")}
              id="language-select"
              value={filters.language}
              labelId="language-select-label"
              renderValue={(selected) =>
                !selected.length
                  ? t("filters.languageNone")
                  : selected.join(", ").toUpperCase()
              }
              onChange={handleSelectChange}
            >
              {Languages.map((language, index) => {
                return (
                  <MenuItem
                    key={index}
                    value={language.value}
                    className="select-menu-item"
                  >
                    <Checkbox checked={filters.language?.includes(language.value)} />
                    <ListItemText primary={language.name} />
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl className="filters-form-item">
            <InputLabel id="age-select-label">{t("filters.age")}</InputLabel>
            <Select<string[]>
              multiple
              name="age"
              label={t("filters.age")}
              variant="outlined"
              id="age-select"
              value={filters.age.map((a) => a.toString())}
              labelId="filters-age-select-label"
              renderValue={(selected) => selected.join(", ")}
              onChange={handleAgeSelectChange}
            >
              {[...Array(50).keys()].map((value) => (
                <MenuItem
                  key={value}
                  value={(value + 1).toString()}
                  className="select-menu-item"
                >
                  <Checkbox checked={filters.age.includes(value + 1)} />
                  <ListItemText primary={value + 1} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <ToggleButtonGroup
            exclusive
            value={filters.gender}
            className="filters-form-item"
            sx={{ width: "100%" }}
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

          <Box
            className="filters-form-item"
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "start", sm: "center" },
              flexDirection: { xs: "column", sm: "row" }
            }}>
            <FormGroup>
              <FormControlLabel
                name="audio"
                label={t("filters.storyAudio")}
                checked={filters.audio}
                control={<Checkbox />}
                onChange={handleAudioCheckboxChange}
              />
            </FormGroup>
          </Box>

          <FormControl className="filters-form-item">
            <InputLabel id="nationality-select-label">
              {tStory("form.settings.moral")}
            </InputLabel>
            <Select<string[]>
              multiple
              name="moral"
              label={tStory("form.settings.moral")}
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
            <InputLabel id="nationality-select-label">
              {tStory("form.settings.tone")}
            </InputLabel>
            <Select<string[]>
              multiple
              name="tone"
              variant="outlined"
              label={tStory("form.settings.tone")}
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
            <InputLabel id="nationality-select-label">
              {tStory("form.settings.environment")}
            </InputLabel>
            <Select<string[]>
              multiple
              name="environment"
              variant="outlined"
              label={tStory("form.settings.environment")}
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
          className="filters-form-footer"
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: (theme) => `1px solid ${theme.palette.text.primary}`
          }}>
          <Button
            size="small"
            variant="text"
            color="secondary"
            onClick={handleOnCancelClick}
          >
            {t("filters.cancel")}
          </Button>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
            <Button
              sx={{ mr: 1 }}
              size="small"
              color="primary"
              variant="outlined"
              onClick={handleOnClearFiltersClick}
            >
              {t("filters.clear")}
            </Button>

            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={handleOnApplyFiltersClick}
            >
              {t("filters.apply")}
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default FiltersPanel;
