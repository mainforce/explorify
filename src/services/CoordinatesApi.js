// src/services/CoordinatesApi.js
import axios from "axios";

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY; // Din API-nyckel

// Funktion för att hämta latitud och longitud för en stad
export const getCoordinates = async (cityName) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
    );
    return response.data.coord; // Returnera latitud och longitud
  } catch (error) {
    console.error("Fel vid Geocoding API-anrop:", error);
    return null; // Lägg till en fallback om något går fel
  }
};
