/**
 * MCP server for STAC API
 * Provides a natural language interface to STAC (SpatioTemporal Asset Catalog) API
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { getToolDefinitions, getToolHandler } from "../tools/index.js";
import { loadConfig, validateConfig } from "../utils/config.js";
import { logger } from "../utils/logger.js";

export class StacMcpServer {
  private server: Server;

  constructor() {
    // Load and validate configuration
    const config = loadConfig();
    validateConfig(config);

    this.server = new Server(
      {
        name: "stac-mcp",
        version: "0.1.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
    logger.info("STAC MCP Server initialized", { config });
  }

  private setupHandlers(): void {
    // List of available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const toolDefinitions = getToolDefinitions();
      logger.debug("Listing tools", { count: toolDefinitions.length });

      return {
        tools: toolDefinitions,
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      logger.debug("Tool called", { name, args });

      try {
        const handler = getToolHandler(name);
        if (!handler) {
          throw new Error(`Unknown tool: ${name}`);
        }

        const result = await handler(args);
        logger.debug("Tool executed successfully", { name });
        return result as any;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        logger.error("Tool execution failed", { name, error: errorMessage });

        return {
          content: [
            {
              type: "text",
              text: `Error executing ${name}: ${errorMessage}`,
            },
          ],
        };
      }
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    logger.info("MCP STAC Server running on stdio");
  }
}
