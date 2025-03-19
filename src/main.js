import { createApp } from "vue";
import "./css/style.css";
import App from "./App.vue";
import router from "./router";
import "@fortawesome/fontawesome-free/css/all.css";
import "mapbox-gl/dist/mapbox-gl.css";

createApp(App).use(router).mount("#app");
