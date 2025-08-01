# Generative UI Chat Demo

A Next.js demo application with a chat interface powered by Anthropic AI, featuring generative UI for weather and stock information.

## Features

- Chat interface with Anthropic AI
- Weather information with 5-day forecast (generative UI)
- Stock price information for any symbol (generative UI)
- Beautiful shadcn/ui components

## Setup

1. Clone and install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the root directory with the following environment variables:

```bash
# Anthropic AI API Key
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Weather API Key (OpenWeatherMap - free tier available)
WEATHER_API_KEY=your_openweathermap_api_key_here

# Stock API Key (Alpha Vantage - free tier available)
STOCK_API_KEY=your_alpha_vantage_api_key_here
```

3. Get your API keys:

   - **Anthropic**: Sign up at https://console.anthropic.com/
   - **OpenWeatherMap**: Sign up at https://openweathermap.org/api
   - **Alpha Vantage**: Sign up at https://www.alphavantage.co/support/#api-key

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Usage

Simply chat with the AI! The application will automatically display:

- Weather information when you ask about weather in any location
- Stock prices when you ask about any stock symbol (e.g., "What's the price of AAPL?")

The AI will use tools to fetch real-time data and display it using beautiful generative UI components.
