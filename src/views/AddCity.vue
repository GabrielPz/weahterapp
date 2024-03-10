<template>
  <div class="grid">
    <div class="city-link" v-for="(city, index) in cities" v-bind:key="index">
      <city-component :city="city" :edit="edit" />
    </div>
  </div>
</template>

<script>
import CityComponent from "../components/City.vue";

export default {
  name: "AddCity",
  props: ["cities", "edit"],
  created() {
    console.log(this.cities);
  },
  components: {
    CityComponent,
  },
};
</script>

<style>
.grid {
  display: grid;
  padding-top: 81px;
  background-color: #31363d;
  width: 100%;
  height: 100vh;
  grid-auto-rows: 250px;
  @media (min-width: 400px) {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
