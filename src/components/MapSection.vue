<template>
  <div id="map"></div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import mapboxgl from "mapbox-gl";
import { getCoordinates } from "../services/CoordinatesApi";

const props = defineProps({
  city: String,
});

const map = ref(null);

const createMap = async (city) => {
  const coordinates = await getCoordinates(city);

  if (!coordinates) {
    console.error("Kunde inte hämta koordinater för staden:", city);
    return;
  }

  const { lat, lon } = coordinates;

  mapboxgl.accessToken = import.meta.env.VITE_APP_MAPBOX_API_KEY;

  const mapInstance = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/satellite-streets-v11",
    center: [lon, lat],
    zoom: 12,
  });

  new mapboxgl.Marker()
    .setLngLat([lon, lat])
    .setPopup(new mapboxgl.Popup().setHTML(`<h3>${city}</h3>`))
    .addTo(mapInstance);

  map.value = mapInstance;
};

onMounted(() => {
  createMap(props.city);
});
</script>

<style scoped>
#map {
  margin-top: 0.5rem;
  border-radius: 7px;
  height: 250px;
  width: 100%;
  grid-column: span 7;
}

@media (min-width: 768px) {
  #map {
    grid-column: span 7;
    margin: 1rem 0 0 0;
    max-height: 300%;
    height: 300px;
    width: 100%;
  }
}
</style>
