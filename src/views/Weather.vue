<template>
  <h1>oi</h1>
</template>

<script>
import axios from "axios";
import { db } from "../firebase/firebaseinit";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
export default {
  name: "WeatherView",
  props: ["APIkey"],
  data() {
    return {
      forecast: null,
      currentWeather: null,
      loading: true,
    };
  },
  created() {
    this.getWeather();
  },
  methods: {
    async getWeather() {
      try {
        const q = query(
          collection(db, "cities"),
          where("city", "==", `${this.$route.params.city}`)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (document) => {
          this.currentWeather = document.data().currentWeather;
          const coordinates = this.currentWeather.coord;
          axios
            .get(
              `https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=current,minutley,alert&appid=${this.APIkey}`
            )
            .then((res) => {
              this.forecast = res.data;
            })
            .then(() => {
              this.loading = false;
              console.log(this.forecast);
              console.log(this.currentWeather);
            });
        });
      } catch (error) {
        console.error("Error removing city: ", error);
      }
    },
  },
};
</script>

<style></style>
