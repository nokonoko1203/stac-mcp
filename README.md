# STAC API MCP

[WIP]

A Model Context Protocol (MCP) server that provides natural language interface to STAC (SpatioTemporal Asset Catalog) APIs.

## Features

- **Natural Language Search**: Search collections and items using natural language queries
- **Collection Management**: Browse and retrieve STAC collections
- **Item Discovery**: Find and examine STAC items with spatial and temporal filters

## Available Tools

1. **search_collections** - Search STAC collections
2. **search_items** - Search items with spatial/temporal filters
3. **get_collection** - Get detailed collection information
4. **get_item** - Get detailed item information
5. **get_statistics** - Get data statistics

## Installation

```bash
npm install
```

## Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Environment variables:

- `STAC_API_URL`: URL of your STAC API (default: http://localhost:8000)
- `STAC_API_TIMEOUT`: API request timeout in ms (default: 30000)
- `LOG_LEVEL`: Logging level (default: info)
- `NODE_ENV`: Environment (default: development)

## Development

```bash
# Build
npm run build

# Run in development mode with auto-reload
npm run dev

# Run built version
npm start

# Lint
npm run lint

# Format code
npm run format

# Run tests
npm test
```

## Usage with Claude Code

### Option 1: Docker (Recommended)

1. Build the Docker image:
   ```bash
   docker build -t stac-mcp .
   ```

2. Add to your Claude Code MCP configuration (`~/.config/claude/claude_desktop_config.json`):
   ```json
   {
     "mcpServers": {
        "stac_mcp": {
          "command": "docker",
          "args": ["run", "-i", "--rm", "-e", "STAC_API_URL", "stac-mcp"],
          "env": {
            "STAC_API_URL": "https://earth-search.aws.element84.com/v1"
          }
        }
     }
   }
   ```

### Option 2: Node.js Direct

1. Build the server:
   ```bash
   npm run build
   ```

2. Add to your Claude Code MCP configuration:
   ```json
   {
     "mcpServers": {
       "stac_mcp": {
         "command": "node",
         "args": ["/absolute/path/to/stac-mcp/mcp/dist/index.js"],
         "env": {
           "STAC_API_URL": "https://earth-search.aws.element84.com/v1"
         }
       }
     }
   }
   ```

### STAC API URL Options

- **External API**: `https://earth-search.aws.element84.com/v1` (AWS Open Data) etc.
- **Local API**: `http://localhost:8000` (requires local STAC server running)

3. Restart Claude Desktop

4. Use natural language with Claude Code:
   - "Show me all available collections"
   - "Find satellite data from 2023 in Tokyo area"
   - "Get statistics for the sample-collection"

## Example Queries

### Search Collections
```
Find all available data collections
```

### Search Items with Location
```
Find satellite data covering Tokyo from 2023
```

### Get Collection Details
```
Tell me about the sample-collection
```

### Get Statistics
```
Show me statistics for all collections
```

## License

MIT
