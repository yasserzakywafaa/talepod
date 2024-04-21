import {
  Box,
  Card,
  Container,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";

import { GenderEnum } from "./domain/state";
import GoogleGemini from "./features/GoogleGemini/GoogleGemini";
import OpenAiGPT from "./features/OpenAiGPT/OpenAiGPT";
import { countries } from "src/shared/countries";
import { useStoryCreatorContext } from "./domain/Provider";

export const StoryCreatorContent = () => {
  const { store, manager } = useStoryCreatorContext();
  const { childInfo } = store.state;

  const handleOnFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleFieldChange = (
    event:
      | SelectChangeEvent
      | React.ChangeEvent<HTMLInputElement | { name: string; value: string }>
  ) => {
    const { name, value } = event.target;
    manager.handleUpdateChildInfo(name, value);
  };

  return (
    <Container className="story-creator" maxWidth={false}>
      <Typography variant="h2">Create a story for your child</Typography>

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
          paddingX={5}
          width="100%"
          display="flex"
          component="form"
          autoComplete="off"
          flexDirection="row"
          alignItems="flex-start"
          className="child-info-form"
          onSubmit={handleOnFormSubmit}
        >
          <Box
            marginX={2}
            display="flex"
            component="div"
            flexDirection="row"
            alignItems="center"
          >
            <RadioGroup
              row
              sx={{ marginLeft: "16px", marginTop: "-16px" }}
              name="radio-buttons-group"
              defaultValue={childInfo.gender}
              aria-labelledby="radio-buttons-group-gender-label"
              onChange={handleFieldChange}
            >
              <FormControlLabel
                value="male"
                control={<Radio />}
                label="Male"
                checked={childInfo.gender === GenderEnum.male}
              />
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
                checked={childInfo.gender === GenderEnum.female}
              />
            </RadioGroup>
          </Box>

          <Box marginX={2} display="flex" component="div" flexDirection="row">
            <TextField
              required
              fullWidth
              id="age"
              name="age"
              label="Age"
              type="number"
              value={childInfo.age}
              onChange={handleFieldChange}
            />
          </Box>

          <Box marginX={2} display="flex" component="div" flexDirection="row">
            <TextField
              required
              fullWidth
              id="hairColor"
              name="hairColor"
              label="Hair Color"
              value={childInfo.hairColor}
              onChange={handleFieldChange}
            />
          </Box>

          <Box marginX={2} display="flex" component="div" flexDirection="row">
            <TextField
              required
              fullWidth
              id="eyeColor"
              name="eyeColor"
              label="Eye Color"
              value={childInfo.eyeColor}
              onChange={handleFieldChange}
            />
          </Box>

          <Box marginX={2} display="flex" component="div" flexDirection="row">
            <TextField
              required
              fullWidth
              id="race"
              name="race"
              label="Race & Color"
              value={childInfo.race}
              onChange={handleFieldChange}
            />
          </Box>

          <Box marginX={2} display="flex" component="div" flexDirection="row">
            <TextField
              required
              fullWidth
              id="height"
              name="height"
              label="Height"
              value={childInfo.height}
              onChange={handleFieldChange}
            />
          </Box>

          <Box
            marginX={2}
            display="flex"
            component="div"
            flexDirection="column"
          >
            <FormControl fullWidth>
              <InputLabel id="nationality-select-label">Nationality</InputLabel>
              <Select
                required
                name="nationality"
                variant="outlined"
                label="Nationality"
                id="nationality-select"
                value={childInfo.nationality.value}
                labelId="nationality-select-label"
                onChange={handleFieldChange}
              >
                {countries.map((country, index) => {
                  return (
                    <MenuItem key={index} value={country.value}>
                      {country.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box
          margin={5}
          width="100%"
          display="flex"
          component="div"
          flexDirection="row"
          justifyContent="space-around"
          className="ai-story-creators-wrapper"
        >
          <Card sx={{ flexBasis: "100%", marginX: 1, padding: 2 }}>
            <Typography variant="h4">Google Gemini</Typography>
            <GoogleGemini />
          </Card>

          <Card sx={{ flexBasis: "100%", marginX: 1, padding: 2 }}>
            <Typography variant="h4">Openai Chat-GPT</Typography>
            <OpenAiGPT />
          </Card>
        </Box>
      </Box>
    </Container>
  );
};
