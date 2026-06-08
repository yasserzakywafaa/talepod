import CONFIG from "../config";
import { OpenAI } from "openai";

/**
 * Creates an OpenAI client - either direct OpenAI or via OpenRouter
 *
 * @param externalApiKey - Optional user-provided OpenAI API key
 *                        If provided: creates direct OpenAI client (bypasses OpenRouter, uses user's OpenAI credits)
 *                        If not provided: creates OpenRouter client (uses OpenRouter API key, can use BYOK from dashboard)
 * @returns Configured OpenAI client instance
 */
export const createOpenRouterClient = (externalApiKey?: string): OpenAI => {
  // Scenario 1: User provided their own OpenAI key - use OpenAI directly
  if (externalApiKey) {
    return new OpenAI({
      apiKey: externalApiKey,
      // This bypasses OpenRouter and uses user's OpenAI credits directly
    });
  }

  // Scenario 2: No user key provided - use OpenRouter
  // OpenRouter will use provider keys configured in dashboard (BYOK)
  const openRouterApiKey = CONFIG.OPENROUTER_API_KEY;
  if (!openRouterApiKey) {
    throw new Error(
      "❌ OpenRouter API key is required. Please set OPENROUTER_API_KEY in your environment variables.",
    );
  }

  return new OpenAI({
    apiKey: openRouterApiKey,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": CONFIG.APP_URL || "https://www.talepod.com",
      "X-Title": "Talepod",
    },
  });
};

/**
 * Converts OpenRouter model names to direct OpenAI model names
 * Example: "openai/gpt-5-mini" -> "gpt-5-mini"
 */
export const normalizeModelName = (
  modelName: string,
  isDirectOpenAI: boolean,
): string => {
  if (!isDirectOpenAI) {
    // Using OpenRouter - return as-is (supports "openai/gpt-5-mini" format)
    return modelName;
  }

  // Using direct OpenAI - strip "openai/" prefix if present
  if (modelName.startsWith("openai/")) {
    return modelName.replace("openai/", "");
  }

  // Remove any suffixes like ":online" for direct OpenAI
  return modelName.split(":")[0];
};

export const handleOpenRouterAIRequest = async (
  modelName: string,
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  options: {
    max_tokens?: number;
    response_format?: { type: string };
    externalOpenAiApiKey?: string;
  } = {},
): Promise<any> => {
  // Use direct OpenAI if external key is provided
  if (options.externalOpenAiApiKey) {
    const openai = createOpenRouterClient(options.externalOpenAiApiKey);
    return await openai.chat.completions.create({
      model: normalizeModelName(modelName, true),
      messages: messages as any,
      ...(options.response_format && {
        response_format: options.response_format as any,
      }),
      max_tokens: options.max_tokens || CONFIG.AI_MAX_TOKENS.DEFAULT,
    });
  }

  // Use OpenRouter
  const isOpenAIModel = modelName.startsWith("openai/");
  if (isOpenAIModel) {
    // Use OpenRouter with provider.only for OpenAI models to prevent fallback
    const response = await handleOpenRouterHttpRequest(modelName, messages, {
      max_tokens: options.max_tokens || CONFIG.AI_MAX_TOKENS.DEFAULT,
      response_format: options.response_format,
      provider: { only: ["openai"] },
    });
    return { choices: response.choices || [] };
  }

  // Use OpenRouter SDK for non-OpenAI models
  const openai = createOpenRouterClient();
  return await openai.chat.completions.create({
    model: modelName,
    messages: messages as any,
    ...(options.response_format && {
      response_format: options.response_format as any,
    }),
    max_tokens: options.max_tokens || CONFIG.AI_MAX_TOKENS.DEFAULT,
  });
};

/**
 * Makes a direct HTTP request to OpenRouter API with provider.only parameter
 * This is needed because the OpenAI SDK doesn't support OpenRouter-specific parameters
 */
export const handleOpenRouterHttpRequest = async (
  model: string,
  messages: Array<{ role: string; content: string }>,
  options: {
    max_tokens?: number;
    response_format?: { type: string };
    provider?: { only: string[] };
  } = {},
): Promise<any> => {
  console.log("🔍 Making OpenRouter request to fetch URL data:", {
    model,
    hasProvider: !!options.provider,
  });

  const openRouterApiKey = CONFIG.OPENROUTER_API_KEY;

  if (!openRouterApiKey) {
    throw new Error(
      "OpenRouter API key is required. Please set OPENROUTER_API_KEY in your environment variables.",
    );
  }

  const requestBody: any = {
    model,
    messages,
    ...options,
  };

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openRouterApiKey}`,
        "HTTP-Referer": CONFIG.APP_URL || "https://www.talepod.com",
        "X-Title": "Talepod",
      },
      body: JSON.stringify(requestBody),
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData.error?.message ||
      `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(errorMessage);
  }

  const responseData = await response.json();
  console.log("🔗 Fetched URL Data from OpenRouter:", {
    data: responseData?.choices?.[0]?.message?.content?.slice(0, 50) ?? null,
  });
  console.log("--------------------------------");

  return responseData;
};
