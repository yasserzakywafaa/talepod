import {
  AdultGenderEnum,
  ChildGenderEnum,
  StoryFilters,
  StoryFiltersEnum,
} from "../types";
import { Filter, FilterOperators } from "mongodb";

type QueryConditionKey = keyof typeof StoryFiltersEnum;

type QueryCondition = {
  [key in QueryConditionKey]: FilterOperators<QueryConditionKey> | undefined;
};

export const getQuery = (filters: StoryFilters) => {
  const queryConditions: QueryCondition | {} = {};

  if (filters.name && filters.name.length) {
    queryConditions[StoryFiltersEnum.name] = {
      $regex: filters.name,
      $options: "i",
    };
  }

  if (filters.language && filters.language.length) {
    queryConditions[StoryFiltersEnum.language] = { $in: filters.language };
  }

  if (filters.age && filters.age.length) {
    queryConditions[StoryFiltersEnum.age] = {
      $in: filters.age,
    };
  }

  if (filters.gender && filters.gender.length) {
    const femaleGenderMapping = [ChildGenderEnum.Girl, AdultGenderEnum.Female];
    const maleGenderMapping = [ChildGenderEnum.Boy, AdultGenderEnum.Male];

    const genderMapping = femaleGenderMapping
      .flatMap((gender) => gender)
      .includes(filters.gender)
      ? femaleGenderMapping
      : maleGenderMapping;

    queryConditions[StoryFiltersEnum.gender] = {
      $in: genderMapping.flatMap((gender) => gender),
    };
  }

  if (filters.audio) {
    queryConditions[StoryFiltersEnum.audio] = { $exists: filters.audio };
  }

  if (filters.moral && filters.moral.length) {
    queryConditions[StoryFiltersEnum.moral] = { $in: filters.moral };
  }

  if (filters.tone && filters.tone.length) {
    queryConditions[StoryFiltersEnum.tone] = { $in: filters.tone };
  }

  if (filters.environment && filters.environment.length) {
    queryConditions[StoryFiltersEnum.environment] = {
      $in: filters.environment,
    };
  }

  const finalQuery =
    Object.keys(queryConditions).length > 0 ? { $and: [queryConditions] } : {};

  return finalQuery as Filter<any>;
};
