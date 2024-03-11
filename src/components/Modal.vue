<template>
  <div @click="closeModal" class="modal" ref="modal">
    <div class="modal-wrap" ref="modalWrap">
      <label for="city-name">Insira o nome da Cidade:</label>
      <input
        type="text"
        name="city-name"
        placeholder="Procure pelo nome da cidade"
        v-model="city"
      />
      <!-- <button @click="addCity">Adicionar</button> -->
      <v-btn
        :loading="loading"
        :disabled="loading"
        color="secondary"
        @click="addCity"
      >
        Adicionar
      </v-btn>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { db } from "../firebase/firebaseinit"; // Import db from your Firebase init file
import { collection, addDoc } from "firebase/firestore"; // Import Firestore methods

export default {
  name: "ModalComponent",
  props: ["APIkey"],
  data() {
    return {
      city: "",
      loading: false,
    };
  },
  methods: {
    closeModal(e) {
      if (e.target === this.$refs.modal) {
        this.$emit("close-modal");
      }
    },
    async addCity() {
      if (this.city === "") {
        alert("Campo não pod estar vazio");
        return;
      }
      this.loading = true;
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&units=metric&lang=pt_br&appid=${this.APIkey}`
        );
        const data = await response.data;
        console.log(data);
        await addDoc(collection(db, "cities"), {
          city: this.city,
          currentWeather: data,
        });
        this.city = "";
        this.loading = false;
        this.$emit("close-modal");
      } catch (err) {
        alert("Erro ao adicioanar a cidade");
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.modal {
  z-index: 101;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  label {
    color: #fff;
  }

  .modal-wrap {
    max-width: 500px;
    border-radius: 8px;
    width: 80%;
    padding: 20px;
    background-color: #31363d;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);

    input {
      color: #fff;
      border: none;
      background-color: transparent;
      border-bottom: 1px solid #fff;
      padding: 6px 4px;
      margin: 10px 0 20px;
      width: 100%;

      &:focus {
        outline: none;
      }
    }

    button {
      background-color: #222325;
      color: #fff;
      padding: 6px 20px;
      border-radius: 8px;
      border: none;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
  }
}
</style>
