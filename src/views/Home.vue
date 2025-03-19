<script setup>
import DestinationForm from "../components/DestinationForm.vue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const abroadDestinations = ref([]);

const fetchDestinations = async () => {
  try {
    const response = await fetch("https://mainforce.se/api/api.php");
    const data = await response.json();
    abroadDestinations.value = data.abroad_destinations || [];
  } catch (error) {
    console.error("Fel vid hämtning av API:", error);
  }
};

const goToRandomDestination = () => {
  const randomIndex = Math.floor(
    Math.random() * abroadDestinations.value.length
  );
  const selectedId = abroadDestinations.value[randomIndex].id;
  router.push(`/destination/${selectedId}`);
};

onMounted(fetchDestinations);
</script>

<template>
  <main>
    <div class="main-container">
      <div class="welcome">
        <h1>Förenkla resan, maxa äventyret!</h1>
        <p>
          På Explorify hjälper vi dig att skapa ett skräddarsytt reseförslag
          baserat på dina behov och önskemål.
        </p>
        <p>
          Fyll i formuläret nedan så är du snart ett steg närmare din drömresa!
        </p>
      </div>

      <div class="feeling-lucky">
        <div>
          <h2>Har du turen på din sida? <br />Slumpa fram ett resmål!</h2>
        </div>
        <div>
          <button
            @click="goToRandomDestination"
            class="animate__animated animate__rubberBand animate__zoomIn"
          >
            Slumpa
          </button>
        </div>
      </div>

      <DestinationForm />
    </div>
  </main>
</template>
