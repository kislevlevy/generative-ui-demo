import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Sun, CloudRain, CloudSnow, Wind } from "lucide-react";
import { format } from "date-fns";

interface WeatherWeeklyData {
  location: string;
  forecast: Array<{
    date: string;
    temp_max: number;
    temp_min: number;
    description: string;
    icon: string;
  }>;
}

interface WeatherWeeklyProps {
  data: WeatherWeeklyData;
  userGender?: "boy" | "girl" | "unknown";
}

const getWeatherIcon = (iconCode: string, size: "sm" | "lg" = "sm") => {
  const iconSize = size === "lg" ? "h-8 w-8" : "h-5 w-5";

  if (iconCode.includes("01"))
    return <Sun className={`${iconSize} text-yellow-500`} />;
  if (
    iconCode.includes("02") ||
    iconCode.includes("03") ||
    iconCode.includes("04")
  )
    return <Cloud className={`${iconSize} text-gray-500`} />;
  if (iconCode.includes("09") || iconCode.includes("10"))
    return <CloudRain className={`${iconSize} text-blue-500`} />;
  if (iconCode.includes("11"))
    return <CloudSnow className={`${iconSize} text-purple-500`} />;
  if (iconCode.includes("13"))
    return <CloudSnow className={`${iconSize} text-blue-200`} />;
  if (iconCode.includes("50"))
    return <Wind className={`${iconSize} text-gray-400`} />;

  return <Sun className={`${iconSize} text-yellow-500`} />;
};

export function WeatherWeekly({
  data,
  userGender = "unknown",
}: WeatherWeeklyProps) {
  // Define color schemes based on gender
  const getColorScheme = () => {
    switch (userGender) {
      case "boy":
        return {
          cardBg:
            "bg-gradient-to-b from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-150",
          border: "border-blue-200",
          titleAccent: "text-blue-800",
          dayBg:
            "bg-gradient-to-b from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-150",
          shadow: "shadow-blue-100 hover:shadow-blue-200",
          dayTitle: "text-blue-800",
          tempHigh: "text-blue-900",
          tempLow: "text-blue-700",
        };
      case "girl":
        return {
          cardBg:
            "bg-gradient-to-b from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-150",
          border: "border-pink-200",
          titleAccent: "text-pink-800",
          dayBg:
            "bg-gradient-to-b from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-150",
          shadow: "shadow-pink-100 hover:shadow-pink-200",
          dayTitle: "text-pink-800",
          tempHigh: "text-pink-900",
          tempLow: "text-pink-700",
        };
      default:
        return {
          cardBg:
            "bg-gradient-to-b from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-150",
          border: "border-gray-200",
          titleAccent: "text-gray-800",
          dayBg:
            "bg-gradient-to-b from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-150",
          shadow: "shadow-gray-100 hover:shadow-gray-200",
          dayTitle: "text-gray-800",
          tempHigh: "text-gray-800",
          tempLow: "text-gray-600",
        };
    }
  };

  const colorScheme = getColorScheme();

  return (
    <div className="w-full max-w-4xl">
      <Card className={`${colorScheme.cardBg} ${colorScheme.border}`}>
        <CardHeader>
          <CardTitle className={`text-2xl ${colorScheme.titleAccent}`}>
            5-Day Weather Forecast - {data.location}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {data.forecast.map((day, index) => (
              <div
                key={index}
                className={`text-center p-4 rounded-lg border ${colorScheme.dayBg} ${colorScheme.border} transition-all duration-200 shadow-sm hover:shadow-md ${colorScheme.shadow}`}
              >
                <div
                  className={`font-semibold text-lg ${colorScheme.dayTitle} mb-3`}
                >
                  {index === 0 ? "Today" : format(new Date(day.date), "EEEE")}
                </div>
                <div className="text-sm text-gray-500 mb-3">
                  {format(new Date(day.date), "MMM d")}
                </div>
                <div className="flex justify-center mb-4">
                  {getWeatherIcon(day.icon, "lg")}
                </div>
                <div className="text-sm text-gray-600 mb-4 capitalize leading-relaxed">
                  {day.description}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">High</span>
                    <span
                      className={`font-bold text-lg ${colorScheme.tempHigh}`}
                    >
                      {Math.round(day.temp_max)}°C
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Low</span>
                    <span className={`font-semibold ${colorScheme.tempLow}`}>
                      {Math.round(day.temp_min)}°C
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
