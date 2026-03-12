# Recipes

A website to share my favorite recipes

It tries to cut all the crap of usual recipe websites.

Some of its features:

- Ingredients can be ticked off once added
- Steps can be highlighted for easier tracking
- Screen stays awake on the recipe pages
- Also works fine without JavaScript (with reduced features)

## MCP Integration

The site exposes static JSON endpoints that can be consumed as resources by an MCP (Model Context Protocol) client.

### Available endpoints

| Endpoint                 | Description                                       |
| ------------------------ | ------------------------------------------------- |
| `/api/recipes.json`      | List of all recipes with their id, title, and URL |
| `/api/recipes/{id}.json` | Full recipe data including ingredients and steps  |

### Configuring an agent

To give an AI agent access to the recipes, add the deployed site's endpoints as resources.
The example below uses [mcp-remote](https://www.npmjs.com/package/mcp-remote) to proxy the static JSON files via the MCP protocol.

**Claude Desktop** (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "recipes": {
      "command": "npx",
      "args": ["mcp-remote", "https://rezepte.taranetz.com/api/recipes.json"]
    }
  }
}
```

**VS Code** (`.vscode/mcp.json`):

```json
{
  "servers": {
    "recipes": {
      "type": "stdio",
      "command": "npx",
      "args": ["mcp-remote", "https://rezepte.taranetz.com/api/recipes.json"]
    }
  }
}
```

Once configured, the agent can list all recipes via `/api/recipes.json` and fetch the full ingredients and steps for any individual recipe via `/api/recipes/{id}.json`.
