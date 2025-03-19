// src/services/WeatherApi.js
import axios from "axios";
import { getCoordinates } from "./CoordinatesApi"; // Importera getCoordinates från CoordinatesApi

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

// Funktion för att hämta väderdata för en stad
export const fetchWeather = async (cityName) => {
  const coordinates = await getCoordinates(cityName);
  if (!coordinates) {
    console.error("Kunde inte hämta koordinater.");
    return null;
  }

  const { lat, lon } = coordinates;

  try {
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    // Filtrera bort varje 3:e timmesdata så vi bara får ett väderdata per dag
    const dailyWeather = weatherResponse.data.list.filter(
      (item, index) => index % 8 === 0
    );

    return {
      ...weatherResponse.data,
      list: dailyWeather,
    };
  } catch (error) {
    console.error("Fel vid väderdata-anrop:", error);
    return null;
  }
};
