/**
 * Tool registration and export
 */
import { ToolDefinition, ToolHandler } from "./types.js";
import { searchCollectionsDefinition, searchCollectionsHandler } from "./searchCollections.js";
import { searchItemsDefinition, searchItemsHandler } from "./searchItems.js";
import { getCollectionDefinition, getCollectionHandler } from "./getCollection.js";
import { getItemDefinition, getItemHandler } from "./getItem.js";
import { getStatisticsDefinition, getStatisticsHandler } from "./getStatistics.js";

export interface Tool {
  definition: ToolDefinition;
  handler: ToolHandler;
}

export const tools: Record<string, Tool> = {
  search_collections: {
    definition: searchCollectionsDefinition,
    handler: searchCollectionsHandler,
  },
  search_items: {
    definition: searchItemsDefinition,
    handler: searchItemsHandler,
  },
  get_collection: {
    definition: getCollectionDefinition,
    handler: getCollectionHandler,
  },
  get_item: {
    definition: getItemDefinition,
    handler: getItemHandler,
  },
  get_statistics: {
    definition: getStatisticsDefinition,
    handler: getStatisticsHandler,
  },
};

export function getToolDefinitions(): ToolDefinition[] {
  return Object.values(tools).map(tool => tool.definition);
}

export function getToolHandler(name: string): ToolHandler | undefined {
  return tools[name]?.handler;
}

export * from "./types.js";
