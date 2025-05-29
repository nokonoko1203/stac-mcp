/**
 * Common type definitions for MCP tools
 */

export interface ToolHandler<T = any> {
  (args: T): Promise<ToolResponse>;
}

export interface ToolResponse {
  content: Array<{
    type: "text";
    text: string;
  }>;
  isError?: boolean;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface SearchCollectionsArgs {
  query?: string;
  limit?: number;
}

export interface SearchItemsArgs {
  query?: string;
  collection?: string;
  bbox?: [number, number, number, number];
  datetime?: string;
  limit?: number;
}

export interface GetCollectionArgs {
  collection_id: string;
}

export interface GetItemArgs {
  collection_id: string;
  item_id: string;
}

export interface GetStatisticsArgs {
  collection_id?: string;
}