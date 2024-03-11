<template>
  <v-app data-app class="main">
    <modal-component
      v-if="modalOpen"
      v-on:close-modal="toggleModal"
      :APIkey="APIkey"
    />
    <NavigationComponent
      v-on:add-city="toggleModal"
      v-on:edit-city="toggleEdit"
      :isHomeView="isHomeView"
      :isDay="isDay"
      :isNight="isNight"
    />
    <router-view
      :cities="cities"
      :edit="edit"
      :APIkey="APIkey"
      :isDay="isDay"
      :isNight="isNight"
      v-on:is-day="dayTime"
      v-on:is-night="nightTime"
      v-on:resetTime="resetTime"
      v-on:edit-city="toggleEdit"
      v-on:disable-remove="disableRemove"
    />
  </v-app>
</template>

<script>
import axios from "axios";
import { db } from "./firebase/firebaseinit"; // Import db from your Firebase init file
import { collection, updateDoc, onSnapshot, query } from "firebase/firestore"; // Import Firestore methods
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
      isDay: null,
      isNight: null,
      cities: [],
      modalOpen: null,
      edit: null,
      isHomeView: null,
    };
  },
  created() {
    this.getCityWeather();
    this.checkRoute();
  },
  methods: {
    async getCityWeather() {
      const citiesCollectionRef = collection(db, "cities");
      const q = query(citiesCollectionRef);

      onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          const hasPendingChanges = change.doc.metadata.hasPendingWrites;
          const cityData = change.doc.data();
          const cityId = change.doc.id;
          if (change.type === "added" && !hasPendingChanges) {
            //Caso sejam cidades que já estão cadastradas no firebase, inicializar a página seus dados são atualizados
            const response = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?q=${cityData.city}&units=metric&lang=pt_br&appid=${this.APIkey}`
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
          } else if (change.type === "removed") {
            //Caso a snapshot seja do tipo removed significa que a cidade em questão foi deletada no firestore
            //logo deletamos ela do app
            this.cities = this.cities.filter(
              (city) => city.city !== change.doc.data().city
            );
          }
        });
      });
    },
    toggleModal() {
      this.modalOpen = !this.modalOpen;
    },
    toggleEdit() {
      this.edit = !this.edit;
    },
    disableRemove() {
      this.edit = null;
    },
    checkRoute() {
      if (this.$route.name === "AddCity") {
        this.isHomeView = true;
        return;
      }
      this.isHomeView = false;
    },
    dayTime() {
      this.isDay = !this.isDay;
    },
    nightTime() {
      this.isNight = !this.isNight;
    },
    resetTime() {
      this.isDay = false;
      this.isNight = false;
    },
  },
  watch: {
    $route() {
      this.checkRoute();
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
  /* max-width: 1024px; */
  width: 100% !important;
  margin: 0 auto;
  height: 100vh !important;
  display: flex;
  .container {
    padding: 0 20px;
  }

  .day {
    transition: 500ms ease all;
    background-color: rgb(59, 150, 249);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  .night {
    transition: 500ms ease all;
    background-color: rgb(20, 42, 95);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
}
</style>
