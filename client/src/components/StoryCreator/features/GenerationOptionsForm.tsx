import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";

import { ChildGenderEnum } from "../store/state";
import { Moral, Morals } from "src/shared/generatedStory/Moral";
import { Tone, Tones } from "src/shared/generatedStory/Tone";
import {
  Environment,
  Environments,
} from "src/shared/generatedStory/Environments";
import { useStoryCreatorContext } from "../store/Provider";
import { Countries, Country } from "src/shared/countries";

const GenerationOptionsForm = () => {
  const {
    store: {
      state: { childInfo, generatedStory },
    },
    manager: { handleUpdateChildInfo, handleUpdateStoryInfo },
  } = useStoryCreatorContext();

  const handleOnFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    handleUpdateChildInfo(name, value);
  };

  const handleOnSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;

    switch (name) {
      case "gender":
        handleUpdateChildInfo(name, value);
        break;

      case "nationality":
        const currentCountryValue = Countries.find((c) => c.value === value);
        handleUpdateChildInfo(name, currentCountryValue as Country);
        break;

      case "moral":
        const currentMoralValue = Morals.find((m) => m.value === value);
        handleUpdateStoryInfo(name, currentMoralValue as Moral);
        break;

      case "tone":
        const currenToneValue = Tones.find((t) => t.value === value);
        handleUpdateStoryInfo(name, currenToneValue as Tone);
        break;

      case "environment":
        const currenEnvironmentValue = Tones.find((t) => t.value === value);
        handleUpdateStoryInfo(name, currenEnvironmentValue as Environment);
        break;
    }
  };

  return (
    <Container className="story-creator" maxWidth={false}>
      <Typography
        variant="h2"
        sx={{
          color: (theme) => (theme.palette.mode === "light" ? "#000" : "#fff"),
          fontSize: { xs: 20, sm: 30 },
        }}
      >
        Create a story for your child
      </Typography>

      <Box
        marginY={5}
        display="flex"
        component="div"
        alignItems="center"
        flexDirection="column"
        justifyContent="center"
      >
        <Box
          noValidate
          marginX={2}
          width="100%"
          display="flex"
          // flexWrap="wrap"
          component="form"
          autoComplete="off"
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="flex-start"
          className="child-info-form"
          onSubmit={handleOnFormSubmit}
        >
          <Box
            width="100%"
            display="flex"
            component="div"
            justifyContent="flex-start"
          >
            <Box mb={4} mr={4} component="div">
              <FormControl>
                <InputLabel id="nationality-select-label">Gender</InputLabel>
                <Select
                  required
                  name="gender"
                  label="Gender"
                  variant="outlined"
                  id="story-gender-select"
                  value={childInfo.gender}
                  labelId="story-gender-select-label"
                  onChange={handleOnSelectChange}
                >
                  {Object.values(ChildGenderEnum).map((gender, index) => {
                    return (
                      <MenuItem key={index} value={gender}>
                        {gender}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>

            <Box mb={4} mr={4} component="div">
              <TextField
                required
                id="age"
                name="age"
                label="Age"
                type="number"
                value={childInfo.age}
                error={!childInfo.age}
                onChange={handleFieldChange}
              />
            </Box>

            <Box mb={4} mr={4} component="div">
              <TextField
                required
                id="name"
                name="name"
                label="Name"
                type="text"
                value={childInfo.name}
                error={!childInfo.name}
                onChange={handleFieldChange}
              />
            </Box>

            <Box mb={4} mr={4} component="div">
              <FormControl>
                <InputLabel id="nationality-select-label">
                  Nationality
                </InputLabel>
                <Select
                  required
                  name="nationality"
                  variant="outlined"
                  label="Nationality"
                  id="nationality-select"
                  value={childInfo.nationality?.value}
                  labelId="nationality-select-label"
                  onChange={handleOnSelectChange}
                >
                  {Countries.map((country, index) => {
                    return (
                      <MenuItem key={index} value={country.value}>
                        {country.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>

            <Box mb={4} mr={4} component="div">
              <TextField
                required
                id="interests"
                name="interests"
                label="Other Interests"
                type="text"
                value={childInfo.interests}
                error={!childInfo.interests}
                onChange={handleFieldChange}
              />
            </Box>
          </Box>

          <Box
            width="100%"
            display="flex"
            component="div"
            justifyContent="flex-start"
          >
            <Box mr={4} component="div" flexDirection="column">
              <FormControl>
                <InputLabel id="nationality-select-label">Moral</InputLabel>
                <Select
                  required
                  name="moral"
                  variant="outlined"
                  label="Moral"
                  id="story-moral-select"
                  value={generatedStory.moral.value}
                  labelId="story-moral-select-label"
                  onChange={handleOnSelectChange}
                >
                  {Morals.map((moral, index) => {
                    return (
                      <MenuItem key={index} value={moral.value}>
                        {moral.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>

            <Box mr={4} component="div" flexDirection="column">
              <FormControl>
                <InputLabel id="nationality-select-label">Tone</InputLabel>
                <Select
                  required
                  name="tone"
                  variant="outlined"
                  label="Tone"
                  id="story-tone-select"
                  value={generatedStory.tone.value}
                  labelId="story-tone-select-label"
                  onChange={handleOnSelectChange}
                >
                  {Tones.map((tone, index) => {
                    return (
                      <MenuItem key={index} value={tone.value}>
                        {tone.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>

            <Box mr={4} component="div" flexDirection="column">
              <FormControl>
                <InputLabel id="nationality-select-label">
                  Environment
                </InputLabel>
                <Select
                  required
                  name="environment"
                  variant="outlined"
                  label="Environment"
                  id="environment-select"
                  value={generatedStory.environment?.value}
                  labelId="environment-select-label"
                  onChange={handleOnSelectChange}
                >
                  {Environments.map((environment, index) => {
                    return (
                      <MenuItem key={index} value={environment.value}>
                        {environment.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default GenerationOptionsForm;
