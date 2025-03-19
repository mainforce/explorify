<script setup>
import { ref, onMounted, toRaw } from "vue";
import { useRouter } from "vue-router";
import { nextTick } from "vue";

const router = useRouter();

const selectedVacationTime = ref(null);
const selectedTripCost = ref(null);
const selectedTravelTime = ref(null);
const selectedLocalExpenses = ref(null);
const selectedTravelingCompany = ref({
  solo: false,
  couple: false,
  friends: false,
  family: false,
});
const selectedPreferences = ref({
  sunbathingSwimming: false,
  children: false,
  shopping: false,
  romantic: false,
  culture: false,
  adventure: false,
  party: false,
});

const destinations = ref([]);

const fetchDestinations = async () => {
  try {
    const response = await fetch("https://mainforce.se/api/api.php");
    const data = await response.json();
    destinations.value = (data.abroad_destinations || []).concat(
      data.sweden_destinations || []
    );

    localStorage.setItem(
      "allDestinations",
      JSON.stringify(destinations.value.map((dest) => toRaw(dest))) // Använd toRaw här
    );
  } catch (error) {
    console.error("Fel vid hämtning av destinationer:", error);
  }
};

const filterDestinations = () => {
  if (
    !selectedVacationTime.value ||
    !selectedTravelTime.value ||
    !selectedTripCost.value ||
    !selectedLocalExpenses.value
  ) {
    return [];
  }

  const filtered = destinations.value.filter((dest) => {
    return dest.information.some((info) => {
      const rawInfo = toRaw(info);

      const vacationTimeMatch =
        String(rawInfo.vacationTime).trim().toLowerCase() ===
        selectedVacationTime.value.trim().toLowerCase();

      const travelTimeMatch =
        Number(rawInfo.travelTime) <= Number(selectedTravelTime.value);

      const tripCostMatch =
        Number(rawInfo.tripCost) <= Number(selectedTripCost.value);

      const localExpensesMatch =
        Number(rawInfo.localExpenses) <= Number(selectedLocalExpenses.value);

      const travelingCompanyMatch = Object.keys(
        selectedTravelingCompany.value
      ).some(
        (key) =>
          selectedTravelingCompany.value[key] && rawInfo.travelingCompany[key]
      );

      const preferenceMatch = Object.keys(selectedPreferences.value).every(
        (key) => !selectedPreferences.value[key] || rawInfo.preference[key]
      );

      return (
        vacationTimeMatch &&
        travelTimeMatch &&
        tripCostMatch &&
        localExpensesMatch &&
        travelingCompanyMatch &&
        preferenceMatch
      );
    });
  });

  return filtered;
};

const labelMapping = {
  sunbathingSwimming: "Sol & Bad",
  children: "Barnvänligt",
  shopping: "Shoppingmöjligheter",
  romantic: "Romantiskt",
  culture: "Kultur & Historia",
  adventure: "Äventyr & Natur",
  party: "Fest & party!",
  solo: "Ensam",
  couple: "I par",
  friends: "Med vänner",
  family: "Med familj",
};

const submitForm = () => {
  if (selectedVacationTime.value && selectedTravelTime.value) {
    const filteredDestinations = filterDestinations(); // Filtrera destinationer baserat på användarens val

    if (filteredDestinations.length > 0) {
      localStorage.setItem(
        "filteredDestinations",
        JSON.stringify(filteredDestinations)
      );

      window.dispatchEvent(new Event("filteredDestinationsUpdated"));

      nextTick(() => {
        router.push({
          name: "Results",
        });
      });
    } else {
      alert(
        "Ajdå, vi kunde inte hitta några resmål som matchar dina preferenser.\n \n Prova att ändra dina val och försök igen."
      );
    }
  }
};

onMounted(() => {
  const storedDestinations = JSON.parse(
    localStorage.getItem("allDestinations")
  );
  if (storedDestinations) {
    destinations.value = storedDestinations;
    console.log(destinations.value.length);
  } else {
    fetchDestinations();
  }
});
</script>

<template>
  <form @submit.prevent="submitForm" class="destination-form">
    <h1>Reseformulär</h1>
    <div class="question">
      <label class="questLabel">Hur länge vill du vara borta?</label>
      <div class="questInDiv">
        <label>Mer än en vecka</label>
        <input type="radio" v-model="selectedVacationTime" value="Längre" />
      </div>
      <div class="questInDiv">
        <label>Weekend</label>
        <input type="radio" v-model="selectedVacationTime" value="Weekend" />
      </div>
    </div>

    <div class="question">
      <label class="questLabel">Hur lång tid vill du resa?</label>
      <div v-for="time in [4, 6, 8, 10, 12]" :key="time" class="questInDiv">
        <label>{{ `Cirka ${time} timmar` }}</label>
        <input type="radio" v-model="selectedTravelTime" :value="time" />
      </div>
    </div>

    <div class="question">
      <label class="questLabel">Med vem reser du?</label>
      <div
        v-for="(value, key) in selectedTravelingCompany"
        :key="key"
        class="questInDiv"
      >
        <label>{{ labelMapping[key] || key }}</label>
        <input type="checkbox" v-model="selectedTravelingCompany[key]" />
      </div>
    </div>

    <div class="question">
      <label class="questLabel"
        >Vad har du för resebudget?<br />Resa inkl. hotell.</label
      >
      <div v-for="cost in [1, 2, 3]" :key="cost" class="questInDiv">
        <label>{{
          cost === 1 ? "Mindre" : cost === 2 ? "Mellan" : "Stor"
        }}</label>
        <input type="radio" v-model="selectedTripCost" :value="cost" />
      </div>
    </div>

    <div class="question">
      <label class="questLabel">Vad har du för fickpengsbudget?</label>
      <div v-for="expense in [1, 2, 3]" :key="expense" class="questInDiv">
        <label>{{
          expense === 1 ? "Mindre" : expense === 2 ? "Mellan" : "Stor"
        }}</label>
        <input type="radio" v-model="selectedLocalExpenses" :value="expense" />
      </div>
    </div>

    <div class="question">
      <label class="questLabel" for="preferences">Vad måste resmålet ha?</label>

      <div
        v-for="(value, key) in selectedPreferences"
        :key="key"
        class="questInDiv"
      >
        <label>{{ labelMapping[key] || key }}</label>
        <input type="checkbox" v-model="selectedPreferences[key]" />
      </div>
    </div>

    <button
      type="submit"
      :disabled="
        !selectedVacationTime ||
        !selectedTravelTime ||
        !selectedTripCost ||
        !selectedLocalExpenses
      "
    >
      Generera
    </button>

    <div
      v-if="
        !selectedVacationTime ||
        !selectedTravelTime ||
        !selectedTripCost ||
        !selectedLocalExpenses
      "
    ></div>
  </form>
</template>
