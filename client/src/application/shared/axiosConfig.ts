import APP_CONSTANTS from "./app_constants";
import END_POINTS from "src/application/shared/endpoints";
import axios from "axios";
import routes from "../routes";

axios.defaults.withCredentials = true;

let isRefreshing = false;
const refreshQueue: Array<() => void> = [];
let isLoggingOut = false;

const processQueue = () => {
  refreshQueue.forEach((cb) => cb());
  refreshQueue.length = 0;
};

const clearAuthAndRedirect = () => {
  if (isLoggingOut) return;
  isLoggingOut = true;

  refreshQueue.length = 0;
  isRefreshing = false;

  localStorage.setItem(APP_CONSTANTS.LOCAL_STORAGE.AUTHENTICATED, "false");
  localStorage.setItem(APP_CONSTANTS.LOCAL_STORAGE.USER, "null");
  localStorage.setItem(APP_CONSTANTS.LOCAL_STORAGE.TOKEN, "null");

  window.location.replace(routes.auth.login);
};

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (isLoggingOut) {
      return Promise.reject(new Error("Logging out"));
    }

    const originalRequest = error.config;

    if (
      originalRequest?.url === END_POINTS.AUTH.REFRESH_TOKEN ||
      originalRequest?.url === END_POINTS.AUTH.LOGOUT
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      clearAuthAndRedirect();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push(() => {
          if (isLoggingOut) {
            reject(new Error("Logging out"));
          } else {
            axios(originalRequest).then(resolve).catch(reject);
          }
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await axios.post(
        END_POINTS.AUTH.REFRESH_TOKEN,
        {},
        { withCredentials: true },
      );
      isRefreshing = false;
      processQueue();
      return axios(originalRequest);
    } catch (refreshError) {
      isRefreshing = false;
      refreshQueue.length = 0;
      clearAuthAndRedirect();
      return Promise.reject(refreshError);
    }
  },
);

export default axios;
