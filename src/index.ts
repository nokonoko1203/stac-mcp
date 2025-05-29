/**
 * MCP STAC Server entry point
 */
import { StacMcpServer } from "./server/StacMcpServer.js";
import { logger } from "./utils/logger.js";

// Start the server
const server = new StacMcpServer();
server.run().catch((error) => {
  logger.error("Failed to start server", { error: error.message });
  console.error("Failed to start server:", error);
  process.exit(1);
});