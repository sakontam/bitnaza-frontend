import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/homeView.vue";
import BitcoinView from "../views/bitcoinView.vue";
import UsdView from "../views/usd_thbView.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/bitcoin",
    name: "Bitcoin",
    component: BitcoinView,
  },
  {
    path: "/usd",
    name: "USD",
    component: UsdView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
