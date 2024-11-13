import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useFavorites() {
  const defaultFavorites = [
    { name: "Delhi", coordinates: { lat: 28.6508, lon: 77.2249 }, id: "Delhi-28" },
    { name: "Mumbai", coordinates: { lat: 19.0144, lon: 72.8479 }, id: "Mumbai-19" },
    { name: "Bengaluru", coordinates: { lat: 12.9762, lon: 77.6033 }, id: "Bengaluru-12" },
    { name: "Chennai", coordinates: { lat: 13.0878, lon: 80.2785 }, id: "Chennai-13" },
    { name: "Paris", coordinates: { lat: 23.0333, lon: 72.6167 }, id: "Paris-23" },
  ];

  const [favorites, setFavorites] = useState(defaultFavorites);
  const queryClient = useQueryClient();

  const favoritesQuery = useQuery({
    queryKey: ["favorites"],
    queryFn: () => favorites,
    initialData: favorites,
    staleTime: Infinity 
  });

  const addFavorite = useMutation({
    mutationFn: async (city) => {
      const newFavorite = {
        ...city,
        coordinates: { lat: city.lat, lon: city.lon },
        id: `${city.name}-${Math.trunc(city.lat)}`,
      };
  
      // Get the latest favorites from the query client cache
      const currentFavorites = queryClient.getQueryData(["favorites"]) || [];
  
      // Prevent duplicates by checking the cache instead of the stale local state
      const exists = currentFavorites.some((fav) => fav.id === newFavorite.id);
      if (exists) return currentFavorites;
  
      const newFavorites = [newFavorite, ...currentFavorites];
      setFavorites(newFavorites);
      queryClient.setQueryData(["favorites"], newFavorites); // Update react-query cache
  
      return newFavorites;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
  
  const removeFavorite = useMutation({
    mutationFn: async (cityId) => {
      
      const currentFavorites = queryClient.getQueryData(["favorites"]) || [];
  
      // Filter out the favorite by cityId
      const newFavorites = currentFavorites.filter(city => city.id !== cityId);
  
      // Update local state
      setFavorites(newFavorites);
  
      
      queryClient.setQueryData(["favorites"], newFavorites);
  
      return newFavorites;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    }
  });
  

  return {
    favorites: favoritesQuery.data,
    addFavorite,
    removeFavorite,
    isFavorite: (lat, name) => {
     
      const currentFavorites = queryClient.getQueryData(["favorites"]) || [];

      const roundedLat = Math.trunc(lat);

      return currentFavorites.some(city => {
        const cityLat = Math.trunc(city.coordinates.lat);
        const cityName = city.name;
        
        return cityLat === roundedLat && cityName === name;
      });
    }
  };
}

