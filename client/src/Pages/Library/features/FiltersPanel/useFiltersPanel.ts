import { LibraryStoryFilters } from "../../store/state";

interface UseFiltersPanelProps {
  activeFiltersCount: number;
  getActiveFiltersCount: (filters: LibraryStoryFilters) => number;
}

export const useFiltersPanel = (
  filters: LibraryStoryFilters,
): UseFiltersPanelProps => {
  const getActiveFiltersCount = (filters: LibraryStoryFilters): number => {
    let count = 0;

    Object.keys(filters).forEach((key) => {
      const value = (filters as unknown as Record<string, unknown>)[key];
      if (key !== "pageNumber" && key !== "pageSize") {
        if (typeof value === "object") {
          if (Array.isArray(value) && value.length) count++;
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
