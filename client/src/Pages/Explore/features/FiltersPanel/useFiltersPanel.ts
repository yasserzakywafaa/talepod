import { Story } from "src/components/StoryCreator/store/state";
import { ExploreStoryFilters } from "../../store/state";

export const useFiltersPanel = (
  stories: Story[],
  filters: ExploreStoryFilters
): Story[] => {
  let filteredStories = [...stories];

  // Profile Info
  const filterByName = (stories: Story[], name: string) => {
    return stories.filter(
      (story) => story.profileInfo && name === story.profileInfo.name
    );
  };

  const filterByGender = (stories: Story[], gender: string[]) => {
    return stories.filter(
      (story) => story.profileInfo && gender.includes(story.profileInfo.gender)
    );
  };

  const filterByAge = (stories: Story[], age: string[]) => {
    return stories.filter(
      (story) =>
        story.profileInfo && age.includes(story.profileInfo.age.toString())
    );
  };

  const filterByLanguage = (stories: Story[], language: string[]) => {
    return stories.filter(
      (story) =>
        story.profileInfo && language.includes(story.profileInfo.language.value)
    );
  };

  // Story Params
  const filterByTone = (stories: Story[], tone: string[]) => {
    return stories.filter(
      (story) =>
        story.storyParams && tone.includes(story.storyParams.tone.value)
    );
  };

  const filterByMoral = (stories: Story[], moral: string[]) => {
    return stories.filter(
      (story) =>
        story.storyParams && moral.includes(story.storyParams.moral.value)
    );
  };

  const filterByEnvironment = (stories: Story[], environment: string[]) => {
    return stories.filter(
      (story) =>
        story.storyParams &&
        environment.includes(story.storyParams.environment.value)
    );
  };

  const name = filterByName(filteredStories, filters.name);
  const gender = filterByGender(filteredStories, filters.gender);
  const age = filterByAge(filteredStories, filters.age);
  const language = filterByLanguage(filteredStories, filters.language);
  const tone = filterByTone(filteredStories, filters.tone);
  const moral = filterByMoral(filteredStories, filters.moral);
  const environment = filterByEnvironment(filteredStories, filters.environment);

  filteredStories = [
    ...name,
    ...gender,
    ...age,
    ...language,
    ...tone,
    ...moral,
    ...environment,
  ];

  console.log("filteredStories:>>>", filteredStories);

  return filteredStories;
};
