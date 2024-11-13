import { useState, useEffect } from "react";
import {
  useWeatherQuery,
  useForecastQuery,
  useReverseGeocodeQuery,
} from "@/hooks/use-weather";
import { CurrentWeather } from "../components/current-weather";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { WeatherForecast } from "../components/weather-forecast";
import { HourlyTemperature } from "../components/hourly-temprature";
import WeatherSkeleton from "../components/loading-skeleton";
import { useFavorites } from "@/hooks/use-favorite";

export function WeatherDashboard() {
  const { favorites } = useFavorites();

  const cities = favorites?.map((city) => ({
    name: city.name,
    coordinates: city.coordinates,
    id: city.id, 
  }));

  const weatherQuery = useWeatherQuery(cities);
  const forecastQuery = useForecastQuery(cities);
  const locationQuery = useReverseGeocodeQuery(cities);

  if (
    weatherQuery.isLoading ||
    forecastQuery.isLoading ||
    locationQuery.isLoading
  ) {
    return <WeatherSkeleton />;
  }

  if (weatherQuery.error || forecastQuery.error || locationQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Failed to fetch weather data. Please try again.</p>
          <Button
            variant="outline"
            onClick={() => {
              weatherQuery.refetch();
              forecastQuery.refetch();
              locationQuery.refetch();
            }}
            className="w-fit"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  

  return (
    <div className="space-y-4">
      <div className="grid gap-6">
        {cities.map((city, index) => {
          const weatherData = weatherQuery.data[index];
          const forecastData = forecastQuery.data[index];
          const locationName = locationQuery.data[index]?.[0];

          return (
            <div key={city.id} className="w-full p-4 rounded-lg">
              <div className="grid gap-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <CurrentWeather
                    data={weatherData}
                    locationName={locationName}
                    isDashboard={true}
                  >
                    <br />
                    <WeatherForecast data={forecastData} />
                    

                    <br />
                    <HourlyTemperature data={forecastData} />
                  </CurrentWeather>
                  
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


