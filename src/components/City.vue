<template>
  <div @click="goToWeather" class="city">
    <i
      v-if="edit"
      @click="removeCity"
      class="far fa-trash-alt remove"
      ref="edit"
    ></i>
    <span>
      {{ this.city.city }}
    </span>
    <div class="weather">
      <span> {{ Math.round(this.city.currentWeather.main.temp) }}&deg; </span>
      <img
        :src="
          require(`../../public/conditions/${this.city.currentWeather.weather[0].icon}.svg`)
        "
        alt=""
      />
    </div>
    <div class="video">
      <video
        autoplay
        loop
        muted
        :src="
          require(`../../public/videos/${this.city.currentWeather.weather[0].icon}.mp4`)
        "
        alt=""
      ></video>
      <div class="bg-overlay"></div>
    </div>
    <v-dialog width="50%" v-model="dialog" persistent>
      <v-card>
        <v-card-title class="text-h5">Confirmar Exclusão</v-card-title>
        <v-card-text>Certeza que deseja excluir esta cidade?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Não</v-btn>
          <v-btn color="blue darken-1" text @click="confirmRemoveCity"
            >Sim</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { db } from "../firebase/firebaseinit"; // Import db from your Firebase init file
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore"; // Import Firestore methods
export default {
  name: "CityComponent",
  props: ["city", "edit"],
  data() {
    return {
      id: null,
      overlay: false,
      dialog: false,
    };
  },
  methods: {
    removeCity() {
      this.dialog = true;
    },
    async confirmRemoveCity() {
      try {
        const q = query(
          collection(db, "cities"),
          where("city", "==", this.city.city)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (document) => {
          await deleteDoc(doc(db, "cities", document.id)); // Delete the document
          this.dialog = false;
        });
      } catch (error) {
        console.error("Error removing city: ", error);
      }
    },
    goToWeather(e) {
      if (e.target === this.$refs.edit) {
        return;
      } else {
        this.$emit("edit-city");
        this.$router.push({
          name: "Weather",
          params: { city: this.city.city },
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.city {
  display: flex;
  position: relative;
  flex-direction: column;
  cursor: pointer;
  padding: 20px;
  flex-basis: 50%;
  min-height: 400px;
  color: #fff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  .remove {
    border-radius: 0px 15px 0 0;
    border: 10px solid rgb(77, 77, 77);
    background-color: rgb(77, 77, 77);
    z-index: 1;
    cursor: pointer;
    font-size: 20px;
    position: absolute;
    bottom: 0px;
    left: 0px;
  }

  span {
    z-index: 1;
    text-transform: capitalize;
    display: block;
    font-size: 25px;
    font-weight: 600;
  }

  .weather {
    display: flex;
    z-index: 1;
    justify-content: flex-end;
    align-items: flex-end;
    flex: 1;

    span {
      font-size: 35px;
      margin-right: 8px;
    }
    img {
      height: 20px;
      width: auto;
      object-fit: cover;
    }
  }

  .video {
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 400px;

    video {
      height: 100%;
      min-height: 400px;
      width: 100%;
      object-fit: cover;
      @media (min-width: 900px) {
        height: auto;
        width: 100%;
      }
    }

    .bg-overlay {
      position: absolute;
      height: 100%;
      width: 100%;
      top: 0;
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
