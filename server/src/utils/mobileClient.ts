import { Request } from "express";

export const MOBILE_CLIENT_HEADER = "x-client-platform";

export const isMobileClient = (request: Request): boolean => {
  const headerValue = request.headers[MOBILE_CLIENT_HEADER];
  const value = Array.isArray(headerValue) ? headerValue[0] : headerValue;
  return value?.toLowerCase() === "mobile";
};
