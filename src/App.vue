<script setup>
import { ref } from "vue";

const isOpen = ref(false);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <header>
    <img
      class="plane-img animate__animated animate__fadeInLeftBig"
      src="./assets/images/plane.png"
    />
    <img
      class="animate__animated animate__fadeIn logo-img"
      src="/src/assets/images/logos/orangeyellow_logo.png"
    />
    <nav>
      <button v-show="!isOpen" @click="toggleMenu" class="menu-small">
        <svg viewBox="0 0 24 24" class="menu-icon">
          <line :class="{ open: isOpen }" x1="3" y1="6" x2="21" y2="6" />
          <line :class="{ open: isOpen }" x1="3" y1="12" x2="21" y2="12" />
          <line :class="{ open: isOpen }" x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <ul class="menu menu-large animate__animated animate__fadeIn">
        <li>
          <router-link to="/">Startsida</router-link>
        </li>

        <li>
          <router-link to="/results">Dina resultat</router-link>
        </li>

        <li>
          <router-link to="/destination">Alla destinationer</router-link>
        </li>
      </ul>
    </nav>
    <div class="menu-large hero-container">
      <img class="hero-img" src="./assets/images/hero_pinkred.png" />
    </div>
    <div v-if="isOpen" class="modal" @click.self="toggleMenu">
      <div class="modal-content">
        <button @click="toggleMenu" class="close-btn">&times</button>
        <ul>
          <li>
            <router-link to="/" @click="toggleMenu">Startsida</router-link>
          </li>
          <li>
            <router-link to="/results" @click="toggleMenu"
              >Dina resultat</router-link
            >
          </li>
          <li>
            <router-link to="/destination" @click="toggleMenu"
              >Alla destinationer</router-link
            >
          </li>
        </ul>
      </div>
    </div>
  </header>
  <router-view :key="$route.path"></router-view>
</template>
