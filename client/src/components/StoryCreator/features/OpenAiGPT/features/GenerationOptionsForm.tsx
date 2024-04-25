import {
  Box,
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
import { Country, countries } from "src/shared/countries";

import { ChildInfo } from "../../../domain/state";

export interface TextGenerationFormProps {
  childInfo: ChildInfo;
  handleUpdateChildInfo: (name: string, value: string | Country) => void;
}

const GenerationOptionsForm = (params: TextGenerationFormProps) => {
  const { childInfo, handleUpdateChildInfo } = params;

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
    handleUpdateChildInfo(name, value);
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
          marginX={2}
          width="100%"
          display="flex"
          flexWrap="wrap"
          component="form"
          autoComplete="off"
          flexDirection="row"
          alignItems="flex-start"
          justifyContent="flex-start"
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
              sx={{ marginLeft: "16px" }}
              name="radio-buttons-group"
              defaultValue={childInfo.gender}
              aria-labelledby="radio-buttons-group-gender-label"
              onChange={handleFieldChange}
            >
              <FormControlLabel
                value="boy"
                name="gender"
                label="Boy"
                control={<Radio />}
              />
              <FormControlLabel
                value="girl"
                name="gender"
                label="Girl"
                control={<Radio />}
              />
            </RadioGroup>
          </Box>

          <Box margin={2} display="flex" component="div" flexDirection="row">
            <TextField
              required
              fullWidth
              id="name"
              name="name"
              label="Name"
              type="text"
              value={childInfo.name}
              onChange={handleFieldChange}
            />
          </Box>

          <Box margin={2} display="flex" component="div" flexDirection="row">
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

          <Box margin={2} display="flex" component="div" flexDirection="row">
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

          <Box margin={2} display="flex" component="div" flexDirection="row">
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

          <Box margin={2} display="flex" component="div" flexDirection="row">
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

          <Box margin={2} display="flex" component="div" flexDirection="column">
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
      </Box>
    </Container>
  );
};

export default GenerationOptionsForm;
