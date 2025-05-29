/**
 * Configuration management for MCP STAC server
 */

export interface Config {
  stacApiUrl: string;
  stacApiTimeout: number;
  logLevel: string;
  nodeEnv: string;
}

/**
 * Load configuration from environment variables with default values
 */
export function loadConfig(): Config {
  return {
    stacApiUrl: process.env.STAC_API_URL || "http://localhost:8000",
    stacApiTimeout: parseInt(process.env.STAC_API_TIMEOUT || "30000"),
    logLevel: process.env.LOG_LEVEL || "info",
    nodeEnv: process.env.NODE_ENV || "development",
  };
}

/**
 * Validate configuration
 */
export function validateConfig(config: Config): void {
  if (!config.stacApiUrl) {
    throw new Error("STAC_API_URL is required");
  }

  if (config.stacApiTimeout <= 0) {
    throw new Error("STAC_API_TIMEOUT must be positive");
  }

  // Validate URL format
  try {
    new URL(config.stacApiUrl);
  } catch (error) {
    throw new Error(`Invalid STAC_API_URL format: ${config.stacApiUrl}`);
  }
}
