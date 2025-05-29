/**
 * Statistics retrieval tool
 */
import { StacApiClient } from "../utils/stacApiClient.js";
import { ToolDefinition, ToolHandler, GetStatisticsArgs } from "./types.js";

export const getStatisticsDefinition: ToolDefinition = {
  name: "get_statistics",
  description: "Get statistics for collections and items",
  inputSchema: {
    type: "object",
    properties: {
      collection_id: {
        type: "string",
        description: "Optional collection ID to get statistics for a specific collection",
      },
    },
  },
};

export const getStatisticsHandler: ToolHandler<GetStatisticsArgs> = async (args: GetStatisticsArgs) => {
  const stacClient = new StacApiClient();

  if (args.collection_id) {
    // Get statistics for a specific collection
    const collection = await stacClient.getCollection(args.collection_id);
    const items = await stacClient.searchItems({
      collections: [args.collection_id],
      limit: 1000, // Get more items to improve statistics
    });

    let response = `# Statistics for Collection: ${args.collection_id}\\n\\n`;
    response += `**Total Items:** ${items.features.length}\\n\\n`;

    // Date range from items
    const dates = items.features
      .map(item => item.properties.datetime)
      .filter(date => date)
      .sort();

    if (dates.length > 0) {
      response += `**Date Range:** ${dates[0]} to ${dates[dates.length - 1]}\\n\\n`;
    }

    return {
      content: [
        {
          type: "text",
          text: response,
        },
      ],
    };
  } else {
    // Get overall statistics
    const collections = await stacClient.searchCollections({ limit: 100 });

    let totalItems = 0;
    for (const collection of collections) {
      const items = await stacClient.searchItems({
        collections: [collection.id],
        limit: 1000,
      });
      totalItems += items.features.length;
    }

    let response = `# Overall STAC Statistics\\n\\n`;
    response += `**Total Collections:** ${collections.length}\\n`;
    response += `**Total Items:** ${totalItems}\\n\\n`;

    response += `**Collections:**\\n`;
    for (const collection of collections) {
      response += `  - ${collection.id}: ${collection.title || collection.id}\\n`;
    }

    return {
      content: [
        {
          type: "text",
          text: response,
        },
      ],
    };
  }
};