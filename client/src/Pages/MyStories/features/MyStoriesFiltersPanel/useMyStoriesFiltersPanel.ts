import { MyStoriesStoryFilters } from "../../store/state";

interface UseFiltersPanelProps {
  activeFiltersCount: number;
  getActiveFiltersCount: (filters: MyStoriesStoryFilters) => number;
}

export const useFiltersPanel = (
  filters: MyStoriesStoryFilters
): UseFiltersPanelProps => {
  const getActiveFiltersCount = (filters: MyStoriesStoryFilters): number => {
    let count = 0;

    Object.keys(filters).forEach((key) => {
      const value = (filters as any)[key];
      if (key !== "pageNumber" && key !== "pageSize") {
        // return;
        if (typeof value === "object") {
          if (value.length) count++;
        }

        if (typeof value !== "object") {
          if (value) count++;
        }
      }
    });

    return count;
  };
  const activeFiltersCount = getActiveFiltersCount(filters);

  return { activeFiltersCount, getActiveFiltersCount };
};
