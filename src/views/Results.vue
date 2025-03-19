<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const filteredDestinations = ref([]);

onMounted(() => {
  const storedDestinations = localStorage.getItem("filteredDestinations");

  if (storedDestinations) {
    try {
      const parsedDestinations = JSON.parse(storedDestinations);

      filteredDestinations.value = parsedDestinations;
    } catch (error) {
      console.error("Fel vid parsing av data från localStorage:", error);
      filteredDestinations.value = [];
    }
  } else {
    console.log("Inga filtrerade destinationer hittades i localStorage.");
    filteredDestinations.value = [];
  }
});

const clearLocalStorage = () => {
  if (localStorage.getItem("filteredDestinations")) {
    const confirmClear = confirm(
      "Är du säker på att du vill rensa dina förslag och gå tillbaka till startsidan?"
    );
    if (!confirmClear) return;
  }

  localStorage.removeItem("filteredDestinations");
  console.log("localStorage rensades");

  router.push("/");
};
</script>

<template>
  <main>
    <div class="main-container">
      <div class="results-for-you">
        <div v-if="filteredDestinations.length > 0">
          <h2>Resmål som passar dig:</h2>
          <div class="destination-grid">
            <div
              class="destination-card"
              v-for="destination in filteredDestinations"
              :key="destination.id"
            >
              <router-link
                :to="`/destination/${destination.id}`"
                class="destination-link"
              >
                <img
                  loading="eager"
                  v-if="
                    destination.curiosa &&
                    destination.curiosa[0].image &&
                    destination.curiosa[0].image.length > 0
                  "
                  :src="destination.curiosa[0].image[0].url"
                  :alt="destination.curiosa[0].image[0].alt"
                  class="destination-image"
                />
                <div class="destination-details">
                  <h4>{{ destination.city }}, {{ destination.country }}</h4>
                </div>
              </router-link>
            </div>
          </div>
        </div>

        <div v-else>
          <div>
            <p>
              Vi är peppade på att få sätta igång och hoppas att du är det
              också!
            </p>
            <p>
              Gå till startsidan och fyll i dina preferenser så kan vi bättre
              föreslå skräddarsydda reseförslag till dig!
            </p>
          </div>
        </div>
        <button class="back-btn">
          <router-link to="/" @click="clearLocalStorage"
            >Till startsidan</router-link
          >
        </button>
      </div>
    </div>
  </main>
</template>
