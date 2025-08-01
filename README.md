# Generative UI Demo

A Next.js demo application with a chat interface powered by Anthropic AI, featuring generative UI for weather and stock information.

## 🎨 Features

✅ Beautiful chat interface with shadcn/ui  
✅ AI-powered conversations with Claude  
✅ Automatic weather display with 5-day forecast  
✅ Stock price display with trading data  
✅ Generative UI components  
✅ Real-time data from trusted APIs

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Environment File

Create a `.env.local` file in the project root:

```bash
# Anthropic AI API Key (Required)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Weather API Key (Required for weather features)
WEATHER_API_KEY=your_openweathermap_api_key_here

# Stock API Key (Required for stock features)
STOCK_API_KEY=your_alpha_vantage_api_key_here
```

### 3. Get Your API Keys

#### Anthropic API Key (Required)

- Go to https://console.anthropic.com/
- Sign up/login and create an API key
- Add it to your `.env.local` file

#### OpenWeatherMap API Key (For Weather)

- Go to https://openweathermap.org/api
- Sign up for free account
- Get your API key from the dashboard
- Free tier includes 1000 calls/day

#### Alpha Vantage API Key (For Stocks)

- Go to https://www.alphavantage.co/support/#api-key
- Sign up for free account
- Get your API key
- Free tier includes 25 calls/day

### 4. Start the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start chatting!

## 💬 Try These Examples

- "What's the weather in New York?"
- "Show me AAPL stock price"
- "How's the weather in Tokyo for the next 5 days?"
- "What's Tesla stock doing today?"
- "Tell me about the weather in London"
- "Get me Microsoft stock information"

## 🔧 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **UI**: shadcn/ui, Tailwind CSS
- **AI**: Anthropic Claude with tool calling
- **APIs**: OpenWeatherMap, Alpha Vantage
- **Icons**: Lucide React

## Usage

Simply chat with the AI! The application will automatically display:

- Weather information when you ask about weather in any location
- Stock prices when you ask about any stock symbol (e.g., "What's the price of AAPL?")

The AI will use tools to fetch real-time data and display it using beautiful generative UI components.
