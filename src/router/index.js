import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import Results from "../views/Results.vue";
import Destination from "../views/Destination.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/results",
    name: "Results",
    component: Results,
  },
  {
    path: "/destination/",
    name: "Destination",
    component: Destination,
  },
  {
    path: "/destination/:id",
    name: "DestinationWithId",
    component: Destination,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
