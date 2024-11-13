import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { useLocationSearch } from "@/hooks/use-weather";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { useFavorites } from "../hooks/use-favorite";
import { toast } from "sonner";

export function CitySearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { data: locations, isLoading } = useLocationSearch(query);
  const { favorites, addFavorite, isFavorite } = useFavorites();

  

  const handleSelect = (cityData) => {
    const [lat, lon, name, country] = cityData.split("|");
    console.log(cityData)
    
    const roundedLat = Math.round(Number(lat) * 10000) / 10000;
    const roundedLon = Math.round(Number(lon) * 10000) / 10000;
    console.log(roundedLat,roundedLon)
    console.log(favorites)
    const isCurrentlyFavorite = isFavorite(lat, name);
    console.log(isCurrentlyFavorite); 
    
    if (isCurrentlyFavorite) {
      toast.error(`${name} Already Exists`);
    } else {
      addFavorite.mutate({
        name: name,
        lat: roundedLat,
        lon: roundedLon,
        country: country
      });
      toast.success(`Added ${name} to Dashboard`);
    }
    setOpen(false);
  };
  
  

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        Search cities...
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput
            placeholder="Search cities..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {query.length > 2 && !isLoading && (
              <CommandEmpty>No cities found.</CommandEmpty>
            )}

            {/* Search Results */}
            <CommandSeparator />
            {locations && locations.length > 0 && (
              <CommandGroup heading="Suggestions">
                {isLoading && (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                )}
                {locations?.map((location) => (
                  <CommandItem
                    key={`${location.lat}-${location.lon}`}
                    value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                    onSelect={handleSelect}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    <span>{location.name}</span>
                    {location.state && (
                      <span className="text-sm text-muted-foreground">
                        , {location.state}
                      </span>
                    )}
                    <span className="text-sm text-muted-foreground">
                      , {location.country}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
