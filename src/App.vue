<template>
  <div class="main">
    <modal-component
      v-if="modalOpen"
      v-on:close-modal="toggleModal"
      :APIkey="APIkey"
    />
    <NavigationComponent v-on:add-city="toggleModal" />
    <router-view :cities="cities" />
  </div>
</template>

<script>
import axios from "axios";
import { db } from "./firebase/firebaseinit"; // Import db from your Firebase init file
import { collection, getDocs, updateDoc } from "firebase/firestore"; // Import Firestore methods
import NavigationComponent from "./components/Navigation.vue";
import ModalComponent from "./components/Modal.vue";

export default {
  name: "App",
  components: {
    NavigationComponent,
    ModalComponent,
  },
  data() {
    return {
      APIkey: "91fc93d15a4ac9726b4b3ed681c1b3a3",
      cities: [],
      modalOpen: null,
    };
  },
  created() {
    this.getCityWeather();
  },
  methods: {
    async getCityWeather() {
      try {
        const querySnapshot = await getDocs(collection(db, "cities"));
        for (const doc of querySnapshot.docs) {
          const cityData = doc.data();
          try {
            const response = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?q=${cityData.city}&appid=${this.APIkey}`
            );
            const weatherData = response.data;
            this.cities.push({
              ...cityData, // Spread the existing city data
              weather: weatherData, // Add the new weather data
            });
            const cityDocRef = doc.ref;
            await updateDoc(cityDocRef, {
              currentWeather: weatherData, // Updating the document with weather data
            });
          } catch (err) {
            console.error(
              "Error fetching weather for city: ",
              cityData.city,
              err
            );
          }
        }
      } catch (error) {
        console.error("Error fetching cities: ", error);
      }
    },
    toggleModal() {
      this.modalOpen = !this.modalOpen;
    },
  },
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Quicksand", sans-serif;
}

.main {
  max-width: 1024px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  justify-content: center; /* Centraliza a MOdal */
  .container {
    padding: 0 20px;
  }
}
</style>
