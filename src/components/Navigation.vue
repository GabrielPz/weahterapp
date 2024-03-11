<template>
  <div>
    <header v-if="isHomeView" class="container add-city">
      <nav>
        <span>Cidades</span>
        <div class="right">
          <i @click="editCity" ref="editCities" class="far fa-edit"></i>
          <i @click="reloadApp" class="fas fa-sync"></i>
          <i @click="addCity" class="fas fa-plus"></i>
        </div>
      </nav>
    </header>
    <header v-else class="container" :class="{ day: isDay, night: isNight }">
      <nav>
        <router-link class="router-link" :to="{ name: 'AddCity' }">
          <i class="fas fa-plus"></i>
        </router-link>
        <span>
          {{ new Date().toLocaleString("pt-br", { weekday: "long" }) }},
          {{ new Date().toLocaleString("pt-br", { day: "2-digit" }) }}
          de
          {{ new Date().toLocaleString("pt-br", { month: "long" }) }}
        </span>
        <span> &deg; C </span>
      </nav>
    </header>
  </div>
</template>

<script>
export default {
  name: "NavigationComponent",
  props: ["isHomeView", "isDay", "isNight"],
  methods: {
    addCity() {
      this.$emit("add-city");
    },
    reloadApp() {
      location.reload();
    },
    editCity() {
      this.$refs.editCities.classList.toggle("edit-active");
      this.$emit("edit-city");
    },
  },
};
</script>

<style lang="scss" scoped>
.add-city {
  background-color: #313640;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

header {
  z-index: 99 !important;
  position: fixed !important;
  /* max-width: 1024px; */
  width: 100 !important;
  nav {
    display: flex;
    color: #fff;
    padding: 30px 0;
    min-width: 100% !important;
    justify-content: space-between;
  }

  .edit-active {
    color: rgba(210, 75, 75, 1);
  }

  .router-link {
    color: #fff;
  }

  .right {
    i {
      font-size: 20px;
    }

    i:nth-child(2),
    i:nth-child(3) {
      margin-left: 16px;
    }
  }

  span {
    font-weight: 600;
  }
}
</style>
