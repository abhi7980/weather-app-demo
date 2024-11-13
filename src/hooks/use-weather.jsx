import { useQuery } from "@tanstack/react-query";
import { getCurrentWeather, getForecast, reverseGeocode, searchLocations } from "../api/weather";

export const WEATHER_KEYS = {
  weather: coords => ["weather", coords],
  forecast: coords => ["forecast", coords],
  location: coords => ["location", coords],
  search: query => ["location-search", query]
};

// Hook to fetch weather data for multiple cities
export function useWeatherQuery(cities) {
  return useQuery({
    queryKey: WEATHER_KEYS.weather(cities),
    queryFn: () => Promise.all(
      cities.map(city => 
        getCurrentWeather(city.coordinates)
      )
    ),
    enabled: cities.length > 0
  });
}

// Hook to fetch forecast data for multiple cities
export function useForecastQuery(cities) {
  return useQuery({
    queryKey: WEATHER_KEYS.forecast(cities),
    queryFn: () => Promise.all(
      cities.map(city => 
        getForecast(city.coordinates)
      )
    ),
    enabled: cities.length > 0
  });
}

// Hook to fetch reverse geocode data for multiple cities
export function useReverseGeocodeQuery(cities) {
  return useQuery({
    queryKey: WEATHER_KEYS.location(cities),
    queryFn: () => Promise.all(
      cities.map(city => 
        reverseGeocode(city.coordinates)
      )
    ),
    enabled: cities.length > 0
  });
}

// Search for multiple locations based on user input
export function useLocationSearch(query) {
  return useQuery({
    queryKey: WEATHER_KEYS.search(query),
    queryFn: () => searchLocations(query),
    enabled: query.length >= 3
  });
}
