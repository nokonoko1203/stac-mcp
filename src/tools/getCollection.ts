/**
 * Collection details retrieval tool
 */
import { StacApiClient } from "../utils/stacApiClient.js";
import { ToolDefinition, ToolHandler, GetCollectionArgs } from "./types.js";

export const getCollectionDefinition: ToolDefinition = {
  name: "get_collection",
  description: "Get detailed information for a specific collection",
  inputSchema: {
    type: "object",
    properties: {
      collection_id: {
        type: "string",
        description: "ID of the collection to retrieve",
      },
    },
    required: ["collection_id"],
  },
};

export const getCollectionHandler: ToolHandler<GetCollectionArgs> = async (args: GetCollectionArgs) => {
  const stacClient = new StacApiClient();
  const collection = await stacClient.getCollection(args.collection_id);

  let response = `# Collection: ${collection.id}\\n\\n`;
  if (collection.title) {
    response += `**Title:** ${collection.title}\\n\\n`;
  }
  if (collection.description) {
    response += `**Description:** ${collection.description}\\n\\n`;
  }
  if (collection.license) {
    response += `**License:** ${collection.license}\\n\\n`;
  }

  // 空間範囲
  if (collection.extent?.spatial?.bbox?.[0]) {
    const bbox = collection.extent.spatial.bbox[0];
    response += `**Spatial Extent:** [${bbox.join(", ")}]\\n\\n`;
  }

  // 時間範囲
  if (collection.extent?.temporal?.interval?.[0]) {
    const interval = collection.extent.temporal.interval[0];
    response += `**Temporal Extent:** ${interval[0]} to ${interval[1]}\\n\\n`;
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