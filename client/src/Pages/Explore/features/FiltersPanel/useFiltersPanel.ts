import {
  AdultGenderEnum,
  ChildGenderEnum,
  Story,
} from "src/components/StoryCreator/store/state";

import { ExploreStoryFilters } from "../../store/state";

interface UseFiltersPanelProps {
  filteredStories: Story[];
  activeFiltersCount: number;
  getActiveFiltersCount: (filters: ExploreStoryFilters) => number;
}

export const useFiltersPanel = (
  stories: Story[],
  filters: ExploreStoryFilters
): UseFiltersPanelProps => {
  let filteredStories = [...stories];

  // Profile Info
  const filterByName = (stories: Story[], name: string | undefined) => {
    return stories.filter((story) => {
      const agrName = name?.toLowerCase();
      const currentName = story.profileInfo.name.toLowerCase().trim();

      return (
        story.profileInfo &&
        agrName &&
        (currentName === agrName || currentName.includes(agrName))
      );
    });
  };

  const filterByGender = (stories: Story[], gender: string | undefined) => {
    return stories.filter((story) => {
      if (story.profileInfo && gender) {
        if (gender === AdultGenderEnum.Male) {
          return (
            story.profileInfo.gender === AdultGenderEnum.Male ||
            story.profileInfo.gender === ChildGenderEnum.Boy
          );
        } else {
          return (
            story.profileInfo.gender === AdultGenderEnum.Female ||
            story.profileInfo.gender === ChildGenderEnum.Girl
          );
        }
      }
      return "";
    });
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

  const filterByAudio = (stories: Story[], audio: boolean | undefined) => {
    return stories.filter((story) => audio === !!story.audioFile?.url);
  };

  const name = filterByName(filteredStories, filters.name);
  const gender = filterByGender(filteredStories, filters.gender);
  const age = filterByAge(filteredStories, filters.age);
  const language = filterByLanguage(filteredStories, filters.language);
  const tone = filterByTone(filteredStories, filters.tone);
  const moral = filterByMoral(filteredStories, filters.moral);
  const environment = filterByEnvironment(filteredStories, filters.environment);
  const audio = filterByAudio(filteredStories, filters.audio);

  // Count active filters
  const getActiveFiltersCount = (filters: ExploreStoryFilters): number => {
    let count = 0;
    Object.values(filters).forEach((filter) => {
      // if (filter && filter.length) count++;
      if (typeof filter === "object") {
        if (filter.length) count++;
      }

      if (typeof filter !== "object") {
        if (filter) count++;
      }
    });

    return count;
  };
  const activeFiltersCount = getActiveFiltersCount(filters);

  // console.log("filterByField:>>>", {
  //   name: filters.name,
  //   gender: filters.gender,
  //   age: filters.age,
  //   language: filters.language,
  //   tone: filters.tone,
  //   moral: filters.moral,
  //   environment: filters.environment,
  //   audio: filters.audio,
  // });

  // console.log("storiesFilterByField:>>>", {
  //   name,
  //   gender,
  //   age,
  //   language,
  //   tone,
  //   moral,
  //   environment,
  //   audio,
  // });

  if (activeFiltersCount) {
    filteredStories = [
      ...name,
      ...gender,
      ...age,
      ...language,
      ...tone,
      ...moral,
      ...environment,
      ...audio,
    ];

    // Remove duplicates from the filters array
    filteredStories = filteredStories.filter((story, index) => {
      return index === filteredStories.findIndex((o) => story._id === o._id);
    });
  } else {
    filteredStories = stories;
  }

  // console.log("filteredStories:>>>", {
  //   filteredStories,
  // });

  // const filterByQueries = (stories: Story[]): Story[] => {
  //   return stories.filter((story) => {
  //     if (story.profileInfo && story.storyParams) {
  //       const filterQuery =
  //         (!filters.name || filters.name === story.profileInfo.name) &&
  //         (!filters.gender.length ||
  //           filters.gender.includes(story.profileInfo.gender)) &&
  //         (!filters.age.length ||
  //           filters.age.includes(story.profileInfo.age.toString())) &&
  //         (!filters.language.length ||
  //           filters.language.includes(story.profileInfo.language.value)) &&
  //         (!filters.tone.length ||
  //           filters.tone.includes(story.storyParams.tone.value)) &&
  //         (!filters.moral.length ||
  //           filters.moral.includes(story.storyParams.moral.value)) &&
  //         (!filters.environment.length ||
  //           filters.environment.includes(story.storyParams.environment.value));

  //       return filterQuery;
  //     }

  //     return [];
  //   });
  // };
  // console.log("queries:>>>", {
  //   queries: filterByQueries(stories),
  // });

  return { filteredStories, activeFiltersCount, getActiveFiltersCount };
};
