import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getApiTools, toolUtils } from "@/lib/ai-tools";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "Anthropic API key not configured" },
        { status: 500 }
      );
    }

    // First, check if the user is asking for weather or stock information
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      tools: getApiTools(),
      tool_choice: { type: "auto" },
    });

    // Check if Claude wants to use a tool
    const toolUse = response.content.find(
      (content) => content.type === "tool_use"
    );

    if (toolUse && toolUse.type === "tool_use") {
      let toolResult;
      const componentType = toolUtils.getComponentType(toolUse.name);

      if (
        toolUse.name === "show_weather_today" ||
        toolUse.name === "show_weather_weekly"
      ) {
        const { location, userGender = "unknown" } = toolUse.input as {
          location: string;
          userGender?: string;
        };

        // Call our weather API
        const weatherResponse = await fetch(
          `${request.nextUrl.origin}/api/weather?location=${encodeURIComponent(
            location
          )}`
        );
        const weatherData = await weatherResponse.json();

        if (weatherResponse.ok) {
          // Add userGender to the weather data
          const weatherDataWithGender = {
            ...weatherData,
            userGender: userGender,
          };

          toolResult = {
            tool_use_id: toolUse.id,
            content: JSON.stringify(weatherDataWithGender),
          };
        } else {
          toolResult = {
            tool_use_id: toolUse.id,
            content: `Error fetching weather data: ${weatherData.error}`,
          };
        }
      }

      if (toolUse.name === "get_stock_price") {
        const { symbol } = toolUse.input as { symbol: string };

        // Call our stock API
        const stockResponse = await fetch(
          `${request.nextUrl.origin}/api/stock?symbol=${encodeURIComponent(
            symbol
          )}`
        );
        const stockData = await stockResponse.json();

        if (stockResponse.ok) {
          toolResult = {
            tool_use_id: toolUse.id,
            content: JSON.stringify(stockData),
          };
        } else {
          toolResult = {
            tool_use_id: toolUse.id,
            content: `Error fetching stock data: ${stockData.error}`,
          };
        }
      }

      // If no toolResult was generated (unhandled tool), create an error result
      if (!toolResult) {
        toolResult = {
          tool_use_id: toolUse.id,
          content: `Error: Tool '${toolUse.name}' is not properly handled by the server.`,
        };
      }

      if (toolResult) {
        // Get Claude's response after using the tool
        const finalResponse = await anthropic.messages.create({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1024,
          messages: [
            {
              role: "user",
              content: message,
            },
            {
              role: "assistant",
              content: response.content,
            },
            {
              role: "user",
              content: [
                {
                  type: "tool_result",
                  tool_use_id: toolResult.tool_use_id,
                  content: toolResult.content,
                },
              ],
            },
          ],
        });

        const textContent = finalResponse.content.find(
          (content) => content.type === "text"
        );

        if (
          componentType &&
          toolResult.content &&
          !toolResult.content.startsWith("Error")
        ) {
          // Return the data for the generative UI component
          return NextResponse.json({
            content:
              (textContent && textContent.type === "text"
                ? textContent.text
                : null) || "I've fetched the latest information for you.",
            component: componentType,
            data: JSON.parse(toolResult.content),
          });
        } else {
          // Return error message
          return NextResponse.json({
            content:
              (textContent && textContent.type === "text"
                ? textContent.text
                : null) ||
              toolResult.content ||
              "I encountered an error fetching the data.",
          });
        }
      }
    }

    // If no tool was used, return Claude's normal response
    const textContent = response.content.find(
      (content) => content.type === "text"
    );
    return NextResponse.json({
      content:
        (textContent && textContent.type === "text"
          ? textContent.text
          : null) || "I'm sorry, I couldn't understand your request.",
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        content:
          "I'm sorry, I encountered an error processing your request. Please try again.",
      },
      { status: 500 }
    );
  }
}
