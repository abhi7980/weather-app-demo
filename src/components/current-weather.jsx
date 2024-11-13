import { useEffect } from "react";
import { useFavorites } from "../hooks/use-favorite";
import { Card, CardContent } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";
export function CurrentWeather({ data, locationName, children, isDashboard }) {
  const {
    weather: [currentWeather],
    main: { temp, feels_like, temp_min, temp_max, humidity },
    wind: { speed },
  } = data;

  const {removeFavorite, favorites} = useFavorites();

  useEffect(() => {
   
  }, [favorites])
  
  // Format temperature
  const formatTemp = (temp) => `${Math.round(temp)}°`;

  const handleRemoveFavorite = (data) => {
    console.log(data.name)
    // Call the mutate function of the removeFavorite mutation
    const formattedLat = Math.trunc(data.coord.lat);
    // const formattedLon = parseFloat(id.lon.toFixed(4));

    // Construct the removalId with the formatted lat and lon
    const removalId = `${data.name}-${formattedLat}`;
  
    removeFavorite.mutate(removalId);
  };

  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="p-6">
        {isDashboard && 
        <div
        className="flex justify-end cursor-pointer text-white-500"
        onClick={() => handleRemoveFavorite(data)} // Pass the city ID to the handler
      >
        X
      </div>
        }
      
        <div className="grid grid-flow-col gap-6 overflow-x-auto md:grid-flow-row md:grid-cols-2">
         
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <h2 className="text-2xl font-bold tracking-tight">
                  {locationName?.name}
                </h2>
              </div>
              <div>
                {locationName?.state && (
                  <p className="text-sm text-muted-foreground">
                    {locationName?.state}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  {locationName?.country}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <p className="text-7xl font-bold tracking-tighter">
                {formatTemp(temp)}
              </p>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Feels like {formatTemp(feels_like)}
                </p>
                <div className="flex gap-2 text-sm font-medium">
                  <span className="flex items-center gap-1 text-blue-500">
                    <ArrowDown className="h-3 w-3" />
                    {formatTemp(temp_min)}
                  </span>
                  <span className="flex items-center gap-1 text-red-500">
                    <ArrowUp className="h-3 w-3" />
                    {formatTemp(temp_max)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Humidity</p>
                  <p className="text-sm text-muted-foreground">{humidity}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-blue-500" />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Wind Speed</p>
                  <p className="text-sm text-muted-foreground">{speed} m/s</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="relative flex aspect-square w-full max-w-[200px] items-center justify-center">
              <img
                src={`https://openweathermap.org/img/wn/${currentWeather.icon}@4x.png`}
                alt={currentWeather.description}
                className="h-full w-full object-contain"
              />
              <div className="absolute bottom-0 text-center">
                <p className="text-sm font-medium capitalize">
                  {currentWeather.description}
                </p>
              </div>
            </div>
          </div>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
