import { ExploreStoryFilters } from "../../store/state";

interface UseFiltersPanelProps {
  activeFiltersCount: number;
  getActiveFiltersCount: (filters: ExploreStoryFilters) => number;
}

export const useFiltersPanel = (
  filters: ExploreStoryFilters
): UseFiltersPanelProps => {
  const getActiveFiltersCount = (filters: ExploreStoryFilters): number => {
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
