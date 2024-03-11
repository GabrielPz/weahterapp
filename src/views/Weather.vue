<template>
  <h1>oi</h1>
</template>

<script>
import axios from "axios";
import { db } from "../firebase/firebaseinit";
import { collection, getDocs, query, where } from "firebase/firestore";
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
        const end = Math.floor(Date.now() / 1000); //Dia de hoje em UNIX
        const start = end - 5 * 24 * 60 * 60; //% dais atrás em UNIX
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (document) => {
          this.currentWeather = document.data().currentWeather;
          const coordinates = this.currentWeather.coord;
          //   axios
          //     .get(
          //       `https://history.openweathermap.org/data/2.5/history/city?lat=${coordinates.lat}&lon=${coordinates.lon}&type=hour&start=${start}&end=${end}&appid=${this.APIkey}`
          //     )
          //     .then((res) => {
          //       this.forecast = res.data;
          //     })
          //     .then(() => {
          //       this.loading = false;
          //       console.log(this.forecast);
          //       console.log(this.currentWeather);
          //     });
        });
      } catch (error) {
        console.error("Error removing city: ", error);
      }
    },
  },
};
</script>

<style></style>
