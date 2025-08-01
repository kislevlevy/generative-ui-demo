// Type definitions
export type ToolCategory = "weather" | "stock";
export type ComponentType = "weather-today" | "weather-weekly" | "stock";

export interface ToolDefinition {
  name: string;
  description: string;
  category: ToolCategory;
  componentType: ComponentType;
  input_schema: {
    type: "object";
    properties: Record<
      string,
      {
        type: string;
        description: string;
      }
    >;
    required: string[];
  };
}

// All tools defined in a single, maintainable array
export const tools: ToolDefinition[] = [
  {
    name: "get_stock_price",
    description:
      "Get current stock price and trading information for a stock symbol",
    category: "stock",
    componentType: "stock",
    input_schema: {
      type: "object",
      properties: {
        symbol: {
          type: "string",
          description:
            "The stock symbol to get price for (e.g., 'AAPL', 'GOOGL', 'TSLA')",
        },
      },
      required: ["symbol"],
    },
  },
  {
    name: "show_weather_today",
    description:
      "Display today's current weather conditions only. Use when user asks specifically for today's weather, current weather, or right now weather.",
    category: "weather",
    componentType: "weather-today",
    input_schema: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description:
            "The city or location to get today's weather for (e.g., 'New York', 'London, UK')",
        },
        userGender: {
          type: "string",
          description:
            "The user's gender based on context clues in their message. Use 'boy' for male users, 'girl' for female users, or 'unknown' if gender cannot be determined from context.",
        },
      },
      required: ["location"],
    },
  },
  {
    name: "show_weather_weekly",
    description:
      "Display 5-day weather forecast. Use when user asks for weather forecast, weekly forecast, upcoming weather, or weather for the next few days.",
    category: "weather",
    componentType: "weather-weekly",
    input_schema: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description:
            "The city or location to get weekly forecast for (e.g., 'New York', 'London, UK')",
        },
        userGender: {
          type: "string",
          description:
            "The user's gender based on context clues in their message. Use 'boy' for male users, 'girl' for female users, or 'unknown' if gender cannot be determined from context.",
        },
      },
      required: ["location"],
    },
  },
];

// Convert tools to API-compatible format (without custom fields)
export interface ApiToolSchema {
  name: string;
  description: string;
  input_schema: {
    type: "object";
    properties: Record<
      string,
      {
        type: string;
        description: string;
      }
    >;
    required: string[];
  };
}

// Get tools in API-compatible format
export const getApiTools = (): ApiToolSchema[] =>
  tools.map(({ name, description, input_schema }) => ({
    name,
    description,
    input_schema,
  }));

// Utility functions for working with tools
export const toolUtils = {
  // Get all tools (main export for external usage)
  getAll: () => tools,

  // Get tools by category
  getByCategory: (category: ToolCategory) =>
    tools.filter((tool) => tool.category === category),

  // Get tool by name
  getByName: (name: string) => tools.find((tool) => tool.name === name),

  // Get component type for a tool
  getComponentType: (toolName: string) =>
    tools.find((tool) => tool.name === toolName)?.componentType,

  // Get tool category
  getCategory: (toolName: string) =>
    tools.find((tool) => tool.name === toolName)?.category,

  // Get all tool names
  getAllNames: () => tools.map((tool) => tool.name),

  // Get tool names by category
  getNamesByCategory: (category: ToolCategory) =>
    tools.filter((tool) => tool.category === category).map((tool) => tool.name),
};
