/**
 * Number of filters the user has actually set.
 *
 * Port of the web `useFiltersPanel.getActiveFiltersCount`: empty arrays,
 * empty strings and `false` all count as unset, and the paging keys are not
 * filters. The value drives the badge on the Filters button and the
 * `hasActiveFilters` flag sent to the stories endpoint.
 */
export const countActiveFilters = (filters: object): number => {
  let count = 0;

  for (const [key, value] of Object.entries(filters)) {
    if (key === "pageNumber" || key === "pageSize") continue;

    if (Array.isArray(value)) {
      if (value.length) count += 1;
      continue;
    }

    if (typeof value !== "object" && value) count += 1;
  }

  return count;
};
