import { API_CONFIG } from "./config";

const createUrl = (endpoint, params) => {
  const searchParams = new URLSearchParams({
    appid: API_CONFIG.API_KEY,
    ...params,
  });
  return `${endpoint}?${searchParams.toString()}`;
};

const fetchData = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather API Error: ${response.statusText}`);
  }
  return response.json();
};

export const getCurrentWeather = async ({ lat, lon }) => {
  const url = createUrl(`${API_CONFIG.BASE_URL}/weather`, {
    lat: lat.toString(),
    lon: lon.toString(),
    units: "metric",
  });
  return fetchData(url);
};

export const getForecast = async ({ lat, lon }) => {
  const url = createUrl(`${API_CONFIG.BASE_URL}/forecast`, {
    lat: lat.toString(),
    lon: lon.toString(),
    units: "metric",
  });
  return fetchData(url);
};

export const reverseGeocode = async ({ lat, lon }) => {
  const url = createUrl(`${API_CONFIG.GEO}/reverse`, {
    lat: lat.toString(),
    lon: lon.toString(),
    limit: "1",
  });
  return fetchData(url);
};

export const searchLocations = async (query) => {
  const url = createUrl(`${API_CONFIG.GEO}/direct`, {
    q: query,
    limit: "5",
  });
  return fetchData(url);
};
