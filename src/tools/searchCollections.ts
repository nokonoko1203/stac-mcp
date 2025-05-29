/**
 * Collection search tool
 */
import { StacApiClient } from "../utils/stacApiClient.js";
import { ToolDefinition, ToolHandler, SearchCollectionsArgs } from "./types.js";

export const searchCollectionsDefinition: ToolDefinition = {
  name: "search_collections",
  description: "Search STAC collections with natural language queries",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "Natural language query for collection search",
      },
      limit: {
        type: "number",
        description: "Maximum number of collections to return",
        default: 10,
      },
    },
  },
};

export const searchCollectionsHandler: ToolHandler<SearchCollectionsArgs> = async (args: SearchCollectionsArgs) => {
  const stacClient = new StacApiClient();
  const collections = await stacClient.searchCollections({
    limit: args.limit || 10,
  });

  let response = `Found ${collections.length} collections:\\n\\n`;
  for (const collection of collections) {
    response += `**${collection.id}** - ${collection.title || collection.id}\\n`;
    if (collection.description) {
      response += `  ${collection.description}\\n`;
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
