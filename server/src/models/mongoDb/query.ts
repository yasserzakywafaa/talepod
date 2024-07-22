import { StoryFilters, StoryFiltersEnum } from "../types";

export const getQuery = (filters: StoryFilters) => {
  const queryConditions = [];

  if (filters.name && filters.name.length) {
    queryConditions.push({
      [StoryFiltersEnum.name]: { $regex: filters.name, $options: "i" },
    });
  }

  if (filters.age && filters.age.length) {
    queryConditions.push({ [StoryFiltersEnum.age]: { $in: filters.age } });
  }

  if (filters.gender && filters.gender.length) {
    queryConditions.push({
      [StoryFiltersEnum.gender]: { $regex: filters.gender, $options: "i" },
    });
  }

  if (filters.language && filters.language.length) {
    queryConditions.push({
      [StoryFiltersEnum.language]: { $in: filters.language },
    });
  }

  if (filters.moral && filters.moral.length) {
    queryConditions.push({ [StoryFiltersEnum.moral]: { $in: filters.moral } });
  }

  if (filters.tone && filters.tone.length) {
    queryConditions.push({ [StoryFiltersEnum.tone]: { $in: filters.tone } });
  }

  if (filters.environment && filters.environment.length) {
    queryConditions.push({
      [StoryFiltersEnum.environment]: { $in: filters.environment },
    });
  }

  return queryConditions.length > 0 ? { $and: queryConditions } : {};
};
