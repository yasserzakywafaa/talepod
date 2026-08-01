/**
 * Axios auth refresh (mirrors `@yasserzakywafaa/client-core` shared `setupAuthAxios`).
 * Inlined for React Native so Metro never resolves `client-core/web` (Material UI).
 */
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const AUTH_AXIOS_SETUP_KEY = Symbol.for(
  "@yasserzakywafaa/client-core/auth-axios-setup",
);

type RetriableRequestConfig = AxiosRequestConfig & {
  _retry?: boolean;
};

type QueuedRequest = {
  config: RetriableRequestConfig;
  resolve: (response: AxiosResponse) => void;
  reject: (reason?: unknown) => void;
};

type ActiveSetup = {
  cleanup: () => void;
};

export interface AxiosPreviewHeaderOptions {
  /**
   * The secret value, or a callback that reads the latest value.
   */
  secret: string | undefined | (() => string | undefined);
  /**
   * Defaults to `X-Preview-Secret`.
   */
  headerName?: string;
  /**
   * Override preview detection. The default checks for `.vercel.app`.
   */
  shouldAttach?: () => boolean;
  /**
   * Hostname fragment used by the default detector.
   */
  hostnameIncludes?: string;
}

/**
 * Storage behavior is injected so the package never imports app constants or
 * accesses localStorage directly.
 */
export interface AxiosAuthStorageCallbacks {
  clearAuth: () => void;
}

export interface SetupAuthAxiosOptions {
  instance: AxiosInstance;
  refreshUrl: string;
  logoutUrl: string;
  loginUrl: string;
  storage: AxiosAuthStorageCallbacks;
  /**
   * Defaults to true and is applied to the supplied Axios instance.
   */
  withCredentials?: boolean;
  preview?: AxiosPreviewHeaderOptions;
  /**
   * Override the refresh request while retaining queue and retry behavior.
   */
  requestRefresh?: (
    instance: AxiosInstance,
    refreshUrl: string,
  ) => Promise<unknown>;
  /**
   * Called once after auth storage is cleared.
   */
  onLogout?: (reason: unknown) => void;
  /**
   * Defaults to a guarded `window.location.replace(loginUrl)`.
   */
  redirectToLogin?: (loginUrl: string) => void;
  /**
   * Customize matching for refresh/logout requests that must bypass handling.
   */
  isExcludedAuthUrl?: (
    requestUrl: string | undefined,
    authUrl: string,
  ) => boolean;
}

export interface AuthAxiosSetup {
  instance: AxiosInstance;
  /**
   * Ejects both interceptors and rejects requests still waiting for refresh.
   */
  cleanup: () => void;
}

export class AuthAxiosSetupDisposedError extends Error {
  constructor() {
    super("The auth Axios interceptor setup was disposed");
    this.name = "AuthAxiosSetupDisposedError";
  }
}

export class AuthLogoutInProgressError extends Error {
  constructor() {
    super("Authentication logout is in progress");
    this.name = "AuthLogoutInProgressError";
  }
}

const defaultIsExcludedAuthUrl = (
  requestUrl: string | undefined,
  authUrl: string,
): boolean => requestUrl === authUrl;

const shouldAttachPreviewHeader = (
  preview: AxiosPreviewHeaderOptions,
): boolean => {
  if (preview.shouldAttach) {
    return preview.shouldAttach();
  }

  if (typeof window === "undefined") {
    return false;
  }

  return window.location.hostname.includes(
    preview.hostnameIncludes ?? ".vercel.app",
  );
};

const getPreviewSecret = (
  preview: AxiosPreviewHeaderOptions,
): string | undefined =>
  typeof preview.secret === "function" ? preview.secret() : preview.secret;

const defaultRedirectToLogin = (loginUrl: string): void => {
  if (typeof window !== "undefined") {
    window.location.replace(loginUrl);
  }
};

/**
 * Configures cookie auth, preview headers, and a single-flight 401 refresh
 * queue on an Axios instance.
 *
 * Calling this function again with the same instance first cleans up the
 * previous setup. The registration is stored on the instance with a global
 * symbol, so duplicate interceptors are also prevented across HMR reloads.
 */
export const setupAuthAxios = ({
  instance,
  refreshUrl,
  logoutUrl,
  loginUrl,
  storage,
  withCredentials = true,
  preview,
  requestRefresh = (client, url) =>
    client.post(url, {}, { withCredentials: true }),
  onLogout,
  redirectToLogin = defaultRedirectToLogin,
  isExcludedAuthUrl = defaultIsExcludedAuthUrl,
}: SetupAuthAxiosOptions): AuthAxiosSetup => {
  const setupRegistry = instance as unknown as Record<
    PropertyKey,
    ActiveSetup | undefined
  >;
  setupRegistry?.[AUTH_AXIOS_SETUP_KEY]?.cleanup();

  instance.defaults.withCredentials = withCredentials;

  let isRefreshing = false;
  let isLoggingOut = false;
  let disposed = false;
  let refreshQueue: QueuedRequest[] = [];

  const rejectQueue = (reason: unknown): void => {
    const queuedRequests = refreshQueue;
    refreshQueue = [];
    queuedRequests.forEach(({ reject }) => reject(reason));
  };

  const replayQueue = (): void => {
    const queuedRequests = refreshQueue;
    refreshQueue = [];

    queuedRequests.forEach(({ config, resolve, reject }) => {
      if (disposed) {
        reject(new AuthAxiosSetupDisposedError());
        return;
      }

      if (isLoggingOut) {
        reject(new AuthLogoutInProgressError());
        return;
      }

      instance.request(config).then(resolve, reject);
    });
  };

  const clearAuthAndRedirect = (reason: unknown): void => {
    if (isLoggingOut || disposed) {
      return;
    }

    isLoggingOut = true;
    isRefreshing = false;
    rejectQueue(new AuthLogoutInProgressError());

    try {
      storage.clearAuth();
      onLogout?.(reason);
    } finally {
      redirectToLogin(loginUrl);
    }
  };

  const requestInterceptorId = instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (!preview || !shouldAttachPreviewHeader(preview)) {
        return config;
      }

      const secret = getPreviewSecret(preview);
      if (secret) {
        config.headers.set(
          preview.headerName ?? "X-Preview-Secret",
          secret,
        );
      }

      return config;
    },
  );

  const responseInterceptorId = instance.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      if (disposed) {
        return Promise.reject(error);
      }

      if (isLoggingOut) {
        return Promise.reject(new AuthLogoutInProgressError());
      }

      const axiosError = error as AxiosError;
      const originalRequest = axiosError.config as
        | RetriableRequestConfig
        | undefined;

      if (!originalRequest) {
        return Promise.reject(error);
      }

      if (
        isExcludedAuthUrl(originalRequest.url, refreshUrl) ||
        isExcludedAuthUrl(originalRequest.url, logoutUrl)
      ) {
        return Promise.reject(error);
      }

      if (axiosError.response?.status !== 401) {
        return Promise.reject(error);
      }

      if (originalRequest._retry) {
        clearAuthAndRedirect(error);
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise<AxiosResponse>((resolve, reject) => {
          refreshQueue.push({
            config: originalRequest,
            resolve,
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        await requestRefresh(instance, refreshUrl);

        if (disposed) {
          const disposedError = new AuthAxiosSetupDisposedError();
          rejectQueue(disposedError);
          return Promise.reject(disposedError);
        }

        isRefreshing = false;
        replayQueue();
        return instance.request(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        rejectQueue(refreshError);
        clearAuthAndRedirect(refreshError);
        return Promise.reject(refreshError);
      }
    },
  );

  const registration: ActiveSetup = {
    cleanup: () => {
      if (disposed) {
        return;
      }

      disposed = true;
      isRefreshing = false;
      instance.interceptors.request.eject(requestInterceptorId);
      instance.interceptors.response.eject(responseInterceptorId);
      rejectQueue(new AuthAxiosSetupDisposedError());

      if (setupRegistry[AUTH_AXIOS_SETUP_KEY] === registration) {
        delete setupRegistry[AUTH_AXIOS_SETUP_KEY];
      }
    },
  };

  Object.defineProperty(setupRegistry, AUTH_AXIOS_SETUP_KEY, {
    configurable: true,
    value: registration,
    writable: true,
  });

  return {
    instance,
    cleanup: registration.cleanup,
  };
};
