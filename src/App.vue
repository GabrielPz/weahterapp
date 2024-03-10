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
import {
  Firestore,
  collection,
  getDocs,
  updateDoc,
  onSnapshot,
  query,
} from "firebase/firestore"; // Import Firestore methods
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
      const citiesCollectionRef = collection(db, "cities");
      const q = query(citiesCollectionRef); // Apply any query constraints here

      onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          const hasPendingChanges = change.doc.metadata.hasPendingWrites;
          const cityData = change.doc.data();
          const cityId = change.doc.id;
          if (change.type === "added" && !hasPendingChanges) {
            //Caso sejam cidades que já estão cadastradas no firebase, inicializar a página seus dados são atualizados
            const response = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?q=${cityData.city}&appid=${this.APIkey}`
            );
            const weatherData = response.data;
            this.cities.push({
              ...cityData,
              currentWeather: weatherData,
            });
            const cityDocRef = change.doc.ref;
            await updateDoc(cityDocRef, {
              currentWeather: weatherData,
            });
          } else if (change.type === "added" && hasPendingChanges) {
            //Se é um novo documento do firebase, significa que foi uma cidade adicionada recentemente
            //portanto apenas seus dados são passados e nenhuma nova chamada a api do weathermap é feita
            this.cities.push(change.doc.data());
          }
        });
      });
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
