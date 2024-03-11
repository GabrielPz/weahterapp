<template>
  <div class="main">
    <div class="weather" :class="{ day: isDay, night: isNight }">
      <div class="weather-wrap">
        <v-progress-circular
          v-if="loading"
          :size="70"
          :width="7"
          color="blue"
          indeterminate
        ></v-progress-circular>
        <current-weather
          :isDay="isDay"
          :isNight="isNight"
          :currentWeather="currentWeather"
        />
        <weather-chart
          :isDay="isDay"
          :isNight="isNight"
          :chartData="chartData"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { db } from "../firebase/firebaseinit";
import { collection, getDocs, query, where } from "firebase/firestore";
import CurrentWeather from "../components/CurrentWeather.vue";
import WeatherChart from "../components/WeatherChart.vue";
export default {
  name: "WeatherView",
  props: ["APIkey", "isDay", "isNight"],
  components: {
    CurrentWeather,
    WeatherChart,
  },
  data() {
    return {
      forecast: null,
      currentWeather: null,
      loading: true,
      currentTime: null,
      chartData: null,
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
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (document) => {
          this.currentWeather = document.data().currentWeather;
          const coordinates = this.currentWeather.coord;
          const resonse = await axios
            .get(`https://api.openweathermap.org/data/3.0/onecall`, {
              params: {
                lat: coordinates.lat,
                lon: coordinates.lon,
                units: "metrics",
                lang: "pt_br",
                appid: this.APIkey,
              },
            })
            .then((res) => {
              this.forecast = res.data;
            });
          this.fetchHistoricalWeatherData(coordinates);
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
    async fetchHistoricalWeatherData(coordinates) {
      const now = Math.floor(Date.now() / 1000);
      let historicalData = [];

      for (let i = 1; i <= 5; i++) {
        const timestamp = now - i * 24 * 60 * 60;
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/onecall/timemachine`,
          {
            params: {
              lat: coordinates.lat,
              lon: coordinates.lon,
              dt: timestamp,
              units: "metric",
              appid: this.APIkey,
            },
          }
        );
        historicalData.push(response.data);
      }
      this.chartData = historicalData;
      this.loading = false;
      this.getCurrentTime();
    },
  },
};
</script>

<style lang="scss" scoped>
.weather {
  transition: 500ms ease;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .weather-wrap {
    overflow: hidden;
    width: 100%;
    margin: 0 auto;
  }
}
</style>
