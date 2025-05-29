/**
 * Item details retrieval tool
 */
import { StacApiClient } from "../utils/stacApiClient.js";
import { ToolDefinition, ToolHandler, GetItemArgs } from "./types.js";

export const getItemDefinition: ToolDefinition = {
  name: "get_item",
  description: "Get detailed information for a specific item",
  inputSchema: {
    type: "object",
    properties: {
      collection_id: {
        type: "string",
        description: "ID of the collection containing the item",
      },
      item_id: {
        type: "string",
        description: "ID of the item to retrieve",
      },
    },
    required: ["collection_id", "item_id"],
  },
};

export const getItemHandler: ToolHandler<GetItemArgs> = async (args: GetItemArgs) => {
  const stacClient = new StacApiClient();
  const item = await stacClient.getItem(args.collection_id, args.item_id);

  let response = `# Item: ${item.id}\\n\\n`;
  if (item.properties.title) {
    response += `**Title:** ${item.properties.title}\\n\\n`;
  }
  if (item.properties.description) {
    response += `**Description:** ${item.properties.description}\\n\\n`;
  }
  if (item.properties.datetime) {
    response += `**Date:** ${item.properties.datetime}\\n\\n`;
  }

  // ジオメトリ
  if (item.bbox) {
    response += `**Bounding Box:** [${item.bbox.join(", ")}]\\n\\n`;
  }

  // アセット
  if (item.assets && Object.keys(item.assets).length > 0) {
    response += `**Assets:**\\n`;
    for (const [key, asset] of Object.entries(item.assets)) {
      response += `  - **${key}**: ${asset.title || key}\\n`;
      if (asset.type) {
        response += `    Type: ${asset.type}\\n`;
      }
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