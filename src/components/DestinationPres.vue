<template>
  <main>
    <div class="destination-container animate__fadeIn" v-if="destination">
      <button @click="goBack">Tillbaka</button>

      <div class="img-title">
        <img
          loading="eager"
          v-if="
            destination.curiosa &&
            destination.curiosa[0].image &&
            destination.curiosa[0].image.length > 0
          "
          :src="destination.curiosa[0].image[0].url"
          :alt="destination.curiosa[0].image[0].alt"
        />
        <div class="destination-name">
          <h2>{{ destination.city || "Stad saknas" }}</h2>
          <h3>{{ destination.country || "Land saknas" }}</h3>
        </div>
      </div>

      <div class="about">
        <p>{{ destination.about }}</p>
      </div>

      <div class="container">
        <div class="travel-company">
          <h3>Sällskap</h3>
          <div
            class="comp"
            v-if="destination.information[0].travelingCompany.solo"
          >
            <i class="fa-info fa-solid fa-user"></i>
            <p>Solo</p>
          </div>
          <div
            class="comp"
            v-if="destination.information[0].travelingCompany.couple"
          >
            <i class="fa-info fa-solid fa-face-grin-hearts"></i>
            <p>Par</p>
          </div>
          <div
            class="comp"
            v-if="destination.information[0].travelingCompany.friends"
          >
            <i class="fa-info fa-solid fa-people-group"></i>
            <p>Vänner</p>
          </div>
          <div
            class="comp"
            v-if="destination.information[0].travelingCompany.family"
          >
            <i class="fa-info fa-solid fa-children"></i>
            <p>Familj</p>
          </div>
        </div>
        <div class="preferences">
          <h3>Om resmålet</h3>
          <div
            class="pref"
            v-if="destination.information[0].preference.sunbathingSwimming"
          >
            <i class="fa-info fa-solid fa-umbrella-beach"></i>
            <p>Sol & Bad</p>
          </div>
          <div
            class="pref"
            v-if="destination.information[0].preference.children"
          >
            <i class="fa-info fa-solid fa-baby-carriage"></i>
            <p>Barnfamilj</p>
          </div>
          <div
            class="pref"
            v-if="destination.information[0].preference.romantic"
          >
            <i class="fa-info fa-solid fa-face-grin-hearts"></i>
            <p>Romantiskt</p>
          </div>
          <div
            class="pref"
            v-if="destination.information[0].preference.culture"
          >
            <i class="fa-info fa-solid fa-masks-theater"></i>
            <p>Kulturellt</p>
          </div>
          <div
            class="pref"
            v-if="destination.information[0].preference.adventure"
          >
            <i class="fa-info fa-solid fa-person-hiking"></i>
            <p>Äventyrligt</p>
          </div>
          <div
            class="pref"
            v-if="destination.information[0].preference.shopping"
          >
            <i class="fa-info fa-solid fa-store"></i>
            <p>Shopping</p>
          </div>
          <div class="pref" v-if="destination.information[0].preference.party">
            <i class="fa-info fa-solid fa-martini-glass"></i>
            <p>Nattliv</p>
          </div>
        </div>
        <div class="destination-info">
          <h3>Reseinfo</h3>
          <div class="info">
            <p>
              Restid:
              {{ convertTravelTime(destination.information[0].travelTime) }}
            </p>
          </div>
          <div class="info">
            <p>
              Resa & bo:
              <span
                v-html="convertCostLevel(destination.information[0].tripCost)"
              ></span>
            </p>
          </div>

          <div class="info">
            <p>
              Fickpengar:
              <span
                v-html="
                  convertCostLevel(destination.information[0].localExpenses)
                "
              ></span>
            </p>
          </div>
          <div class="info">
            <p>Rek. vistelse: {{ destination.information[0].vacationTime }}</p>
          </div>
        </div>
      </div>

      <div class="information">
        <div class="curiosa">
          <div class="dont-miss">
            <h3>Du vill inte missa...</h3>
            <p>{{ destination.curiosa[0].dontMiss1 }}</p>
            <p>{{ destination.curiosa[0].dontMiss2 }}</p>
            <p>{{ destination.curiosa[0].dontMiss3 }}</p>
          </div>
          <h3>Om resmålet:</h3>
          <div class="about-dest">
            <div class="one-row">
              <h6>Språk:</h6>
              <p>{{ destination.curiosa[0].language }}</p>
            </div>
            <div class="one-row">
              <h6>Invånare:</h6>
              <p>{{ destination.curiosa[0].residents }}</p>
            </div>
            <div class="one-row">
              <h6>Valuta:</h6>
              <p>{{ destination.curiosa[0].currency }}</p>
            </div>
            <div class="one-row">
              <h6>Tidsskillnad:</h6>
              <p>{{ destination.curiosa[0].timeDifference }}</p>
            </div>
            <div class="one-row">
              <h6>Eluttag:</h6>
              <p>{{ destination.curiosa[0].powerOutlets }}</p>
            </div>
            <div class="one-row">
              <h6>Visum:</h6>
              <p>{{ destination.curiosa[0].visaRequirement }}</p>
            </div>
            <div class="one-row">
              <h6>Vattenkvalitet:</h6>
              <p>{{ destination.curiosa[0].waterQuality }}</p>
            </div>
            <div class="one-row">
              <h6>Bäst period för besök:</h6>
              <p>{{ destination.curiosa[0].bestTimeToVisit }}</p>
            </div>
            <div class="one-row">
              <h6>Alkoholinställning:</h6>
              <p>{{ destination.curiosa[0].alcoholPolicy }}</p>
            </div>
          </div>
          <div class="two-rows">
            <h3>Rolig kuriosa:</h3>
            <p class="popculture">
              {{ destination.curiosa[0].inPopularCulture }}
            </p>
            <div class="about-dest">
              <div class="one-row">
                <h6>Känd mat:</h6>
                <p>{{ destination.curiosa[0].famousFood }}</p>
              </div>
              <div class="one-row">
                <h6>Största sport:</h6>
                <p>{{ destination.curiosa[0].biggestSport }}</p>
              </div>
              <div class="one-row">
                <h6>Känd från stan:</h6>
                <p>{{ destination.curiosa[0].famousFromHere }}</p>
              </div>
            </div>
          </div>
        </div>
        <DestinationLanguage :destination="destination" />
        <WeatherSection :city="destination.city" />
        <MapSection :city="destination.city" />
      </div>
    </div>

    <div v-else>
      <p>Destinationen laddas...</p>
    </div>
  </main>
</template>

<script setup>
import { defineProps } from "vue";
import WeatherSection from "./WeatherSection.vue";
import MapSection from "./MapSection.vue";
import { useRouter } from "vue-router";
import DestinationLanguage from "./DestinationLanguage.vue";

const router = useRouter();

const goBack = () => {
  router.go(-1);
};

const props = defineProps({
  destination: Object,
});

const travelTimeMapping = {
  4: "Under 4h",
  6: "Runt 6h",
  8: "Runt 8h",
  10: "Runt 10h",
  12: "Över 12h",
};

const generateMoneyIcons = (count, max = 3) => {
  let icons = "";

  for (let i = 0; i < Math.floor(count); i++) {
    icons += '<i class="fas fa-dollar-sign"></i>';
  }

  for (let i = Math.ceil(count); i < max; i++) {
    icons += '<i class="fas fa-dollar-sign" style="opacity: 0.2;"></i>'; // Tom ikon
  }

  return icons;
};

const convertCostLevel = (level) => {
  const costMapping = {
    1: generateMoneyIcons(1),
    2: generateMoneyIcons(2),
    3: generateMoneyIcons(3),
  };
  return costMapping[level] || "Okänt";
};

const convertTravelTime = (time) => travelTimeMapping[time] || "Okänd reslängd";
</script>
