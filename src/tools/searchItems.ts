/**
 * Item search tool
 */
import { StacApiClient } from "../utils/stacApiClient.js";
import { ToolDefinition, ToolHandler, SearchItemsArgs } from "./types.js";

export const searchItemsDefinition: ToolDefinition = {
  name: "search_items",
  description: "Search STAC items with spatial, temporal, and text filters",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "Natural language search query",
      },
      collection: {
        type: "string",
        description: "Collection ID to search within",
      },
      bbox: {
        type: "array",
        items: { type: "number" },
        minItems: 4,
        maxItems: 4,
        description: "Bounding box [west, south, east, north]",
      },
      datetime: {
        type: "string",
        description: "ISO 8601 format datetime range",
      },
      limit: {
        type: "number",
        description: "Maximum number of items to return",
        default: 10,
      },
    },
  },
};

export const searchItemsHandler: ToolHandler<SearchItemsArgs> = async (args: SearchItemsArgs) => {
  const stacClient = new StacApiClient();
  let result: any;

  if (args.collection) {
    // Use collection items endpoint if collection is specified
    const searchParams: any = {
      limit: args.limit || 10,
    };
    if (args.bbox) searchParams.bbox = args.bbox;
    if (args.datetime) searchParams.datetime = args.datetime;

    result = await stacClient.getCollectionItems(args.collection, searchParams);
  } else {
    // Use search endpoint for cross-collection search
    const searchParams: any = {
      limit: args.limit || 10,
    };

    if (args.bbox) searchParams.bbox = args.bbox;
    if (args.datetime) searchParams.datetime = args.datetime;

    try {
      result = await stacClient.searchItems(searchParams);
    } catch (error) {
      // Fallback: search all collections individually
      const collections = await stacClient.searchCollections({ limit: 100 });
      const allItems: any[] = [];

      for (const collection of collections) {
        try {
          const items = await stacClient.getCollectionItems(collection.id, { limit: args.limit || 10 });
          allItems.push(...items.features);
        } catch (e) {
          // Skip failed collections
          continue;
        }
      }

      result = {
        features: allItems.slice(0, args.limit || 10),
      };
    }
  }

  let response = `Found ${result.features.length} items`;
  if (args.collection) {
    response += ` in collection "${args.collection}"`;
  }
  response += `:\\n\\n`;

  for (const item of result.features) {
    response += `**${item.id}**\\n`;
    if (item.properties.title) {
      response += `  Title: ${item.properties.title}\\n`;
    }
    if (item.properties.datetime) {
      response += `  Date: ${item.properties.datetime}\\n`;
    }
    response += `\\n`;
  }

  return {
    content: [
      {
        type: "text",
        text: response,
      },
    ],
  };
};