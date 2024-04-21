import {
  Box,
  Button,
  Card,
  Divider,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";

import { GenderEnum } from "./domain/state";
import GoogleGemini from "./features/GoogleGemini/GoogleGemini";
import OpenAiGPT from "./features/OpenAiGPT/OpenAiGPT";
import { useStoryCreatorContext } from "./domain/Provider";

export const StoryCreatorContent = () => {
  const { store, manager } = useStoryCreatorContext();
  const { childInfo } = store.state;

  const handleOnFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    // console.log("form is submitting:>>>", {
    //   userPrompt,
    // });

    // if (userPrompt) {
    //   setIsFetching(true);
    //   // handleGenerateContent(userPrompt);
    //   handleChat(userPrompt);
    // }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;

    if (name && value) {
      manager.handleUpdateChildInfo(name, value as string);
    }
  };

  return (
    <div className="story-creator">
      <h1>Create a Story for Your Child</h1>

      <Card>
        <Box
          marginY={5}
          display="flex"
          component="div"
          flexDirection="row"
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <Box
            noValidate
            paddingX={5}
            width="100%"
            display="flex"
            component="form"
            autoComplete="off"
            flexDirection="column"
            onSubmit={handleOnFormSubmit}
          >
            <Box
              marginY={2}
              display="flex"
              component="div"
              flexDirection="row"
              alignItems="center"
            >
              <FormLabel id="radio-buttons-group-gender-label">
                Gender
              </FormLabel>

              <RadioGroup
                row
                sx={{ marginLeft: "16px" }}
                name="radio-buttons-group"
                defaultValue={childInfo.gender}
                aria-labelledby="radio-buttons-group-gender-label"
                onChange={handleChange}
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

            <Box marginY={2} display="flex" component="div" flexDirection="row">
              <TextField
                fullWidth
                id="age"
                name="age"
                label="Age"
                type="number"
                value={childInfo.age}
                onChange={handleChange}
                required
              />
            </Box>

            <Box marginY={2} display="flex" component="div" flexDirection="row">
              <TextField
                fullWidth
                id="hairColor"
                name="hairColor"
                label="Hair Color"
                value={childInfo.hairColor}
                onChange={handleChange}
                required
              />
            </Box>

            <Box marginY={2} display="flex" component="div" flexDirection="row">
              <TextField
                fullWidth
                id="eyeColor"
                name="eyeColor"
                label="Eye Color"
                value={childInfo.eyeColor}
                onChange={handleChange}
                required
              />
            </Box>

            <Box marginY={2} display="flex" component="div" flexDirection="row">
              <TextField
                fullWidth
                id="race"
                name="race"
                label="Race & Color"
                value={childInfo.race}
                onChange={handleChange}
                required
              />
            </Box>

            <Box marginY={2} display="flex" component="div" flexDirection="row">
              <TextField
                fullWidth
                id="height"
                name="height"
                label="Height"
                value={childInfo.height}
                onChange={handleChange}
                required
              />
            </Box>

            <Box marginY={2} display="flex" component="div" flexDirection="row">
              <TextField
                fullWidth
                id="nationality"
                name="nationality"
                label="Nationality"
                value={childInfo.nationality}
                onChange={handleChange}
                required
              />
            </Box>
            <Box marginY={2} display="flex" component="div" flexDirection="row">
              <Button variant="contained" color="primary" type="submit">
                Generate Story
              </Button>
            </Box>
          </Box>

          <Divider
            style={{ margin: "0 2rem" }}
            orientation="vertical"
            sx={{ height: "100vh" }}
          />

          <Box
            margin={5}
            width="100%"
            display="flex"
            component="div"
            flexDirection="column"
          >
            <Card>
              <GoogleGemini />
            </Card>

            <Divider style={{ margin: "2rem 0" }} />

            <Card>
              <OpenAiGPT />
            </Card>
          </Box>
        </Box>
      </Card>
    </div>
  );
};
