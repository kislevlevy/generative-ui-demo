import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Clock,
} from "lucide-react";

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  marketCap?: string;
  lastUpdated: string;
}

export function StockDisplay({ data }: { data: StockData }) {
  const isPositive = data.change >= 0;
  const changeColor = isPositive ? "text-green-600" : "text-red-600";
  const bgColor = isPositive
    ? "bg-green-50 border-green-200"
    : "bg-red-50 border-red-200";
  const badgeColor = isPositive
    ? "bg-green-100 text-green-800"
    : "bg-red-100 text-red-800";

  return (
    <div className="w-full max-w-4xl">
      <Card className={`${bgColor} border-2`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${
                  isPositive ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <BarChart3 className={`h-6 w-6 ${changeColor}`} />
              </div>
              <div>
                <div className="font-bold text-xl">{data.symbol}</div>
                <div className="text-gray-600 text-sm">{data.name}</div>
              </div>
            </div>
            <Badge className={badgeColor}>
              {isPositive ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {isPositive ? "+" : ""}
              {data.changePercent.toFixed(2)}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Price Section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-gray-500" />
                <span className="text-3xl font-bold">
                  {data.price.toFixed(2)}
                </span>
              </div>
              <div
                className={`flex items-center gap-1 ${changeColor} font-semibold`}
              >
                {isPositive ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>
                  {isPositive ? "+" : ""}
                  {data.change.toFixed(2)} ({isPositive ? "+" : ""}
                  {data.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>

            <Separator />

            {/* Trading Data */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Open</span>
                  <span className="font-medium">${data.open.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">High</span>
                  <span className="font-medium text-green-600">
                    ${data.high.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Low</span>
                  <span className="font-medium text-red-600">
                    ${data.low.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Volume</span>
                  <span className="font-medium">
                    {(data.volume / 1000000).toFixed(1)}M
                  </span>
                </div>
                {data.marketCap && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Market Cap</span>
                    <span className="font-medium">{data.marketCap}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">52W Range</span>
                  <span className="font-medium text-xs">-</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Last Updated */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {data.lastUpdated}</span>
            </div>

            {/* Price Range Indicator */}
            <div className="space-y-2">
              <div className="text-sm text-gray-600">Today&apos;s Range</div>
              <div className="relative">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className={`h-2 rounded-full ${
                      isPositive ? "bg-green-400" : "bg-red-400"
                    }`}
                    style={{
                      width: `${
                        ((data.price - data.low) / (data.high - data.low)) * 100
                      }%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>${data.low.toFixed(2)}</span>
                  <span>${data.high.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
