/**
 * Centralized AI Model Configuration for MCP Servers
 *
 * This file contains all AI model settings used by MCP servers.
 * To change the AI model, update the values here and all services will use the new configuration.
 */

/**
 * The primary AI model used for all Gemini API calls.
 */
export const AI_MODEL = 'gemini-3-flash-preview'

/**
 * Default configuration for AI model requests.
 */
export const AI_MODEL_CONFIG = {
  thinkingBudget: 0,
}
