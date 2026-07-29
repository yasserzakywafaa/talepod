export interface Integrations {
  wordPress: IntegrationWordPress[];
  ghost: IntegrationGhost;
}

export interface IntegrationBaseParams {
  isIntegrated: boolean;
  isWebsiteValid: boolean;
  autoPublish: boolean;
}

export interface IntegrationWordPress extends IntegrationBaseParams {
  id: string;
  label?: string;
  credentials: IntegrationWordpressCredentials;
}

export type IntegrationWordPressPostStatus =
  | "publish"
  | "draft"
  | "pending"
  | "private";

export interface IntegrationWordpressCredentials {
  username: string;
  applicationPassword: string;
  websiteUrl: string;
  postStatus: IntegrationWordPressPostStatus;
}

export interface IntegrationGhost extends IntegrationBaseParams {
  credentials: IntegrationGhostCredentials;
}

export interface IntegrationGhostCredentials {
  adminApiKey: string;
  websiteUrl: string;
}
