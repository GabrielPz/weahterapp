<template>
  <div class="main">
    <v-progress-circular
      v-if="loading"
      :size="70"
      :width="7"
      color="purple"
      indeterminate
    ></v-progress-circular>
    <div v-else class="weather" :class="{ day: isDay, night: isNight }">
      <div class="weather-wrap"></div>
      <current-weather
        :isDay="isDay"
        :isNight="isNight"
        :currentWeather="currentWeather"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { db } from "../firebase/firebaseinit";
import { collection, getDocs, query, where } from "firebase/firestore";
import CurrentWeather from "../components/CurrentWeather.vue";
export default {
  name: "WeatherView",
  props: ["APIkey", "isDay", "isNight"],
  components: {
    CurrentWeather,
  },
  data() {
    return {
      forecast: null,
      currentWeather: null,
      loading: true,
      currentTime: null,
    };
  },
  created() {
    this.getWeather();
  },
  beforeDestroy() {
    this.$emit("resetTime");
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
          axios
            .get(
              `https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${this.APIkey}`
            )
            .then((res) => {
              this.forecast = res.data;
            })
            .then(() => {
              this.loading = false;
              this.getCurrentTime();
            });
        });
      } catch (error) {
        console.error("Error removing city: ", error);
      }
    },
    getCurrentTime() {
      const dateObject = new Date();
      this.currentTime = dateObject.getHours();
      const sunrise = new Date(this.currentWeather.sunrise * 1000).getHours();
      const sunset = new Date(this.currentWeather.sunset * 1000).getHours();
      if (this.currentTime > sunrise && this.currentTime < sunset) {
        this.$emit("is-day");
      } else {
        this.$emit("is-night");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.weather {
  transition: 500ms ease;
  width: 100%;
  height: 100%;
  overflow: scroll;

  .weather-wrap {
    overflow: hidden;
    width: 100%;
    margin: 0 auto;
  }
}
</style>
