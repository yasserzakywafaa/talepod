import {
  AdultGenderEnum,
  ChildGenderEnum,
  StoryFilters,
  StoryFiltersEnum,
} from "../types/story";
import { Filter, FilterOperations, ObjectId } from "mongodb";

type QueryCondition = Partial<Record<StoryFiltersEnum, FilterOperations<any>>>;

type FilterResult =
  | {
      $and: QueryCondition[];
    }
  | {};

export const getQuery = (
  filters: StoryFilters,
  userId?: string
): Filter<FilterResult | []> => {
  const queryConditions: QueryCondition[] = [];

  if (userId && userId.length) {
    queryConditions.push({
      [StoryFiltersEnum.author]: {
        $exists: true,
        $eq: new ObjectId(userId),
      },
    });
  }

  if (filters.name && filters.name.length) {
    queryConditions.push({
      [StoryFiltersEnum.name]: {
        $regex: filters.name,
        $options: "i",
      },
    });
  }

  if (filters.language && filters.language.length) {
    queryConditions.push({
      [StoryFiltersEnum.language]: {
        $in: filters.language,
      },
    });
  }

  if (filters.age && filters.age.length) {
    queryConditions.push({
      [StoryFiltersEnum.age]: {
        $in: filters.age,
      },
    });
  }

  if (filters.gender && filters.gender.length) {
    const femaleGenderMapping = [ChildGenderEnum.Girl, AdultGenderEnum.Female];
    const maleGenderMapping = [ChildGenderEnum.Boy, AdultGenderEnum.Male];

    const genderMapping = femaleGenderMapping
      .flatMap((gender) => gender)
      .includes(filters.gender)
      ? femaleGenderMapping
      : maleGenderMapping;

    queryConditions.push({
      [StoryFiltersEnum.gender]: {
        $in: genderMapping.flatMap((gender) => gender),
      },
    });
  }

  if (filters.audio) {
    queryConditions.push({
      [StoryFiltersEnum.audio]: {
        $exists: filters.audio,
      },
    });
  }

  if (filters.createdByAdmin) {
    queryConditions.push({
      [StoryFiltersEnum.createdByAdmin]: {
        $exists: filters.createdByAdmin,
      },
    });
  }

  if (filters.moral && filters.moral.length) {
    queryConditions.push({
      [StoryFiltersEnum.moral]: {
        $in: filters.moral,
      },
    });
  }

  if (filters.tone && filters.tone.length) {
    queryConditions.push({
      [StoryFiltersEnum.tone]: {
        $in: filters.tone,
      },
    });
  }

  if (filters.environment && filters.environment.length) {
    queryConditions.push({
      [StoryFiltersEnum.environment]: {
        $in: filters.environment,
      },
    });
  }

  const finalQuery: FilterResult =
    queryConditions.length > 0 ? { $and: queryConditions } : {};

  return finalQuery;
};
