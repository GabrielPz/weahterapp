import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import AddCity from "../views/AddCity.vue";
import WeatherView from "../views/Weather.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "AddCity",
    component: AddCity,
  },
  {
    path: "/weather/:city",
    name: "Weather",
    component: WeatherView,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
