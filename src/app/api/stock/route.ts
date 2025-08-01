import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const symbol = searchParams.get("symbol");

  if (!symbol) {
    return NextResponse.json(
      { error: "Symbol parameter is required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.STOCK_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Stock API key not configured" },
      { status: 500 }
    );
  }

  try {
    // Get quote data from Alpha Vantage
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol.toUpperCase()}&apikey=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch stock data");
    }

    const data = await response.json();

    if (data["Error Message"]) {
      return NextResponse.json(
        { error: "Invalid symbol or API limit reached" },
        { status: 400 }
      );
    }

    if (data["Note"]) {
      return NextResponse.json(
        { error: "API call frequency limit reached" },
        { status: 429 }
      );
    }

    const quote = data["Global Quote"];

    if (!quote || Object.keys(quote).length === 0) {
      return NextResponse.json(
        { error: "No data available for this symbol" },
        { status: 404 }
      );
    }

    // Get company name (fallback to symbol if overview not available)
    let companyName = symbol.toUpperCase();
    try {
      const overviewResponse = await fetch(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol.toUpperCase()}&apikey=${apiKey}`
      );
      const overview = await overviewResponse.json();
      if (overview.Name) {
        companyName = overview.Name;
      }
    } catch {
      // Fallback to symbol if overview fails
    }

    const stockData = {
      symbol: quote["01. symbol"],
      name: companyName,
      price: parseFloat(quote["05. price"]),
      change: parseFloat(quote["09. change"]),
      changePercent: parseFloat(quote["10. change percent"].replace("%", "")),
      open: parseFloat(quote["02. open"]),
      high: parseFloat(quote["03. high"]),
      low: parseFloat(quote["04. low"]),
      volume: parseInt(quote["06. volume"]),
      lastUpdated: new Date(
        quote["07. latest trading day"]
      ).toLocaleDateString(),
    };

    return NextResponse.json(stockData);
  } catch (error) {
    console.error("Stock API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stock data" },
      { status: 500 }
    );
  }
}
