import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const location = searchParams.get("location");

  if (!location) {
    return NextResponse.json(
      { error: "Location parameter is required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Weather API key not configured" },
      { status: 500 }
    );
  }

  try {
    // Get current weather
    const currentWeatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        location
      )}&appid=${apiKey}&units=metric`
    );

    if (!currentWeatherResponse.ok) {
      const errorData = await currentWeatherResponse.text();
      console.error(
        "Weather API Error:",
        currentWeatherResponse.status,
        errorData
      );
      throw new Error(
        `Weather API Error (${currentWeatherResponse.status}): ${errorData}`
      );
    }

    const currentWeather = await currentWeatherResponse.json();

    // Get 5-day forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
        location
      )}&appid=${apiKey}&units=metric`
    );

    if (!forecastResponse.ok) {
      const errorData = await forecastResponse.text();
      console.error("Forecast API Error:", forecastResponse.status, errorData);
      throw new Error(
        `Forecast API Error (${forecastResponse.status}): ${errorData}`
      );
    }

    const forecast = await forecastResponse.json();

    // Process forecast data to get daily summaries
    const dailyForecast = [];
    const processedDates = new Set();

    for (const item of forecast.list) {
      const date = new Date(item.dt * 1000).toDateString();

      if (!processedDates.has(date) && dailyForecast.length < 5) {
        dailyForecast.push({
          date: item.dt_txt.split(" ")[0],
          temp_max: item.main.temp_max,
          temp_min: item.main.temp_min,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        });
        processedDates.add(date);
      }
    }

    const weatherData = {
      location: currentWeather.name + ", " + currentWeather.sys.country,
      current: {
        temperature: currentWeather.main.temp,
        description: currentWeather.weather[0].description,
        feels_like: currentWeather.main.feels_like,
        humidity: currentWeather.main.humidity,
        wind_speed: currentWeather.wind.speed,
        visibility: currentWeather.visibility,
        icon: currentWeather.weather[0].icon,
      },
      forecast: dailyForecast,
    };

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error("Weather API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}
