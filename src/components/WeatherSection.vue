<template>
  <div
    class="weather-section"
    v-if="weatherData && weatherData.list && weatherData.list.length > 0"
  >
    <div
      v-for="(weatherItem, index) in weatherData.list"
      :key="index"
      class="weather-item"
    >
      <div class="weather-day">
        <p>
          <strong>{{
            new Date(weatherItem.dt * 1000).toLocaleDateString("sv-SE", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })
          }}</strong>
        </p>
      </div>

      <img
        :src="
          'http://openweathermap.org/img/wn/' +
          weatherItem.weather[0].icon +
          '@2x.png'
        "
        :alt="weatherItem.weather[0].description || 'Väderikon'"
      />

      <div class="weather-details">
        <strong>Temp:</strong>
        {{ Math.floor(weatherItem.main.temp) }}°C <strong>Luftfukt:</strong>
        {{ weatherItem.main.humidity }}%
      </div>
    </div>
  </div>

  <div v-else>
    <p>Ingen väderinformation tillgänglig.</p>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { fetchWeather } from "../services/WeatherApi";

const props = defineProps({
  city: String,
});

const weatherData = ref(null);

const getWeather = async (city) => {
  const weather = await fetchWeather(city);
  if (weather) {
    weatherData.value = weather;
  } else {
    console.error("Väderdata kunde inte hämtas.");
  }
};

watch(
  () => props.city,
  (newCity) => {
    if (newCity) {
      getWeather(newCity);
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
@use "/src/css/partials/partials/" as p;

.weather-section {
  grid-column: span 7;
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 1rem;
}

.weather-day {
  font-size: 1rem;
}

.weather-item {
  background-color: p.$seventh-color;
  padding: 0rem 2rem;
  margin-bottom: 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  gap: 15px;
}

.weather-item img {
  width: 75px;
  height: 75px;
}

.weather-details {
  font-size: 1rem;
  width: 120px;
  line-height: 1.5rem;
  text-align: right;
}

@media (min-width: 600px) {
  .weather-section {
    flex-direction: row;
    width: 100%;
    display: flex;
    justify-content: space-between;

    .weather-item {
      flex-direction: column;
      min-width: 100px;
      height: 150px;
      padding: 1rem;

      img {
        margin-top: -1rem;
      }
    }

    .weather-day {
      margin: -10px;
      margin-top: -5px;
    }

    .weather-details {
      margin-top: -2rem;
      font-size: 0.9rem;
      text-align: center;
    }
  }
}

@media (min-width: 768px) {
  .weather-section {
    grid-column: 7/8;
    grid-row: 1/5;
    display: flex;
    flex-direction: column;
    justify-content: start;
    margin-top: -0.1rem;
  }

  .weather-day {
    font-size: 1rem;
    width: 150px;
  }

  .weather-item {
    background-color: p.$seventh-color;
    padding: 0rem 2rem;
    margin-bottom: 10px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    gap: 15px;
  }

  .weather-item img {
    width: 75px;
    height: 75px;
  }

  .weather-details {
    font-size: 1rem;
    width: 120px;
    line-height: 1.5rem;
    text-align: right;
  }
}
</style>
