import CONFIG from "../config";
import {
  createOpenRouterClient as createCoreOpenRouterClient,
  OpenRouterHttpOptions,
  OpenRouterRequestOptions,
} from "@yasserzakywafaa/server-core";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { OpenAI } from "openai";

// OpenRouter/OpenAI client + request helpers are provided by server-core; TalePod
// injects its API key, app identity, and default token budget.
const openRouter = createCoreOpenRouterClient({
  apiKey: CONFIG.OPENROUTER_API_KEY,
  appUrl: CONFIG.APP_URL || "https://www.talepod.com",
  appTitle: "Talepod",
  defaultMaxTokens: CONFIG.AI_MAX_TOKENS.DEFAULT,
  logger: {
    debug: (message, details) => console.log(`🔍 ${message}:`, details),
    error: (message, details) => console.error(`❌ ${message}:`, details),
  },
});

export const createOpenRouterClient = (externalApiKey?: string): OpenAI =>
  openRouter.createClient(externalApiKey);

export const normalizeModelName = (
  modelName: string,
  isDirectOpenAI: boolean,
): string => openRouter.normalizeModelName(modelName, isDirectOpenAI);

export const handleOpenRouterAIRequest = (
  modelName: string,
  messages: ChatCompletionMessageParam[],
  options: OpenRouterRequestOptions = {},
) => openRouter.handleOpenRouterAIRequest(modelName, messages, options);

export const handleOpenRouterHttpRequest = (
  modelName: string,
  messages: ChatCompletionMessageParam[],
  options: OpenRouterHttpOptions = {},
) => openRouter.handleOpenRouterHttpRequest(modelName, messages, options);
