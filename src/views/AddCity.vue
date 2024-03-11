<template>
  <div class="grid">
    <div class="city-link" v-for="(city, index) in cities" v-bind:key="index">
      <city-component
        v-on:edit-city="toggleEdit"
        v-on:disable-remove="disableRemove"
        :city="city"
        :edit="edit"
      />
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
  methods: {
    toggleEdit() {
      this.$emit("edit-city");
    },
    disableRemove() {
      this.$emit("disable-remove");
    },
  },
};
</script>

<style>
.grid {
  display: grid;
  padding-top: 81px;
  background-color: #31363d;
  width: 100%;
  height: 100%;
  grid-auto-rows: auto; /* Adjust row height to content */
  grid-template-columns: repeat(
    auto-fill,
    minmax(200px, 1fr)
  ); /* Flexible columns but with a minimum width */
  gap: 20px; /* Optional: Adds some space between grid items */
  justify-content: center; /* Centers items in the grid when there's extra space */
  @media (min-width: 400px) {
    grid-template-columns: repeat(
      auto-fill,
      minmax(200px, 1fr)
    ); /* Ensure two items per row with a minimum width of 200px */
  }
}
</style>
