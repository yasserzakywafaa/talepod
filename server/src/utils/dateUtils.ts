export const getEndDateByInterval = (
  interval: "day" | "month" | "week" | "year"
): Date => {
  switch (interval) {
    case "month":
      return new Date(new Date().setMonth(new Date().getMonth() + 1));

    case "year":
      return new Date(new Date().setFullYear(new Date().getFullYear() + 1));

    default:
      // After 10 years
      return new Date(new Date().setFullYear(new Date().getFullYear() + 10));
  }
};
