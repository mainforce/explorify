import { getCoordinates } from "./CoordinatesApi";

export const getMapUrl = async (cityName) => {
  console.log("Hämtar karta för staden:", cityName);

  const coordinates = await getCoordinates(cityName);

  if (!coordinates) {
    console.error("Kunde inte hämta koordinater för staden:", cityName);
    return null;
  }

  console.log("Koordinater för staden:", coordinates);
  const { lat, lon } = coordinates;

  const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${lon},${lat},12,0/600x400?access_token=pk.eyJ1IjoibWFpbmZvcmNlIiwiYSI6ImNtNnA5NHZ3dTE1Ym0yc3M4MGQ5b3NpOW4ifQ.e4oVf4wEPDvldjfqpwMgFw`;
  console.log("Genererad karta-URL:", mapUrl);

  return mapUrl;
};
