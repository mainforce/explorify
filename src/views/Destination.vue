<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import DestinationPres from "../components/DestinationPres.vue";

const route = useRoute();
const destination = ref(null);
const allDestinations = ref([]);
const loading = ref(true);

const fetchAllDestinations = async () => {
  try {
    const response = await fetch("https://mainforce.se/api/api.php"); // 🔹 Använder HTTPS
    const data = await response.json();

    allDestinations.value = [
      ...data.abroad_destinations,
      ...data.sweden_destinations,
    ];

    localStorage.setItem("destinations", JSON.stringify(allDestinations.value));

    fetchDestinationById();
  } catch (error) {
    console.error("Fel vid hämtning av alla destinationer:", error);
  }
};

const fetchDestinationById = () => {
  if (!route.params.id) {
    destination.value = null;
    return;
  }

  destination.value = allDestinations.value.find(
    (dest) => dest.id === Number(route.params.id)
  );

  if (!destination.value) {
    console.log("❌ Ingen destination hittades");
    destination.value = null;
  }
};

onMounted(async () => {
  loading.value = true;

  const savedDestinations = localStorage.getItem("destinations");
  if (savedDestinations) {
    allDestinations.value = JSON.parse(savedDestinations);
    fetchDestinationById();
  } else {
    await fetchAllDestinations();
  }

  loading.value = false;
});

watch([() => route.params.id, allDestinations], fetchDestinationById, {
  deep: true,
});

const groupedDestinations = computed(() => {
  const grouped = {};
  allDestinations.value.forEach((dest) => {
    const letter = dest.city[0].toUpperCase();
    if (!grouped[letter]) {
      grouped[letter] = [];
    }
    grouped[letter].push(dest);
  });
  return grouped;
});

</script>

<template>
  <main>
    <div class="main-container">
      <div v-if="loading">Laddar...</div>

      <div v-else>
        <div v-if="destination">
          <DestinationPres :destination="destination" />
        </div>
        <div v-else>
          <div v-if="route.params.id">
            <h1>ERROR: Destinationen finns inte</h1>
          </div>

          <div
            class="all-destinations"
            v-if="Object.keys(groupedDestinations).length > 0"
          >
            <h2>Alla destinationer</h2>
            <div
              v-for="(destinations, letter) in groupedDestinations"
              :key="letter"
            >
              <h3>{{ letter }}</h3>
              <div class="destination-grid">
                <div
                  class="destination-card"
                  v-for="dest in destinations"
                  :key="dest.id"
                >
                  <router-link
                    :to="`/destination/${dest.id}`"
                    class="destination-link"
                  >
                    <img
                      loading="eager"
                      v-if="
                        dest.curiosa &&
                        dest.curiosa[0].image &&
                        dest.curiosa[0].image.length > 0
                      "
                      :src="dest.curiosa[0].image[0].url"
                      :alt="dest.curiosa[0].image[0].alt"
                      class="destination-image"
                    />
                    <div class="destination-details">
                      <h4>{{ dest.city }}, {{ dest.country }}</h4>
                    </div>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
