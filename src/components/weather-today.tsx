import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  Wind,
  Droplets,
  Thermometer,
  Eye,
} from "lucide-react";

interface WeatherTodayData {
  location: string;
  current: {
    temperature: number;
    description: string;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    visibility: number;
    icon: string;
  };
}

const getWeatherIcon = (iconCode: string, size: "sm" | "lg" = "sm") => {
  const iconSize = size === "lg" ? "h-16 w-16" : "h-5 w-5";

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

export function WeatherToday({ data }: { data: WeatherTodayData }) {
  return (
    <div className="w-full max-w-2xl">
      <Card className="bg-gradient-to-br from-blue-400 to-blue-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-2xl">
            <div>
              <div className="text-lg font-normal text-blue-100">
                Today's Weather
              </div>
              <div>{data.location}</div>
            </div>
            {getWeatherIcon(data.current.icon, "lg")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-6xl font-bold mb-2">
                {Math.round(data.current.temperature)}°C
              </div>
              <div className="text-blue-100 capitalize text-lg">
                {data.current.description}
              </div>
            </div>
            <div className="text-right">
              <div className="text-blue-100 text-sm">Feels like</div>
              <div className="text-3xl font-semibold">
                {Math.round(data.current.feels_like)}°C
              </div>
            </div>
          </div>

          <Separator className="bg-blue-300 mb-6" />

          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <Droplets className="h-6 w-6" />
              <div>
                <div className="text-blue-100 text-sm">Humidity</div>
                <div className="text-lg font-semibold">
                  {data.current.humidity}%
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Wind className="h-6 w-6" />
              <div>
                <div className="text-blue-100 text-sm">Wind Speed</div>
                <div className="text-lg font-semibold">
                  {data.current.wind_speed} m/s
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Eye className="h-6 w-6" />
              <div>
                <div className="text-blue-100 text-sm">Visibility</div>
                <div className="text-lg font-semibold">
                  {Math.round(data.current.visibility / 1000)} km
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Thermometer className="h-6 w-6" />
              <div>
                <div className="text-blue-100 text-sm">Feels Like</div>
                <div className="text-lg font-semibold">
                  {Math.round(data.current.feels_like)}°C
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
