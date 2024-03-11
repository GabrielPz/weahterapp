<template>
  <div class="current-weather">
    <div class="container"></div>
  </div>
</template>

<script>
import axios from "axios";
import { db } from "../firebase/firebaseinit";
import { collection, getDocs, query, where } from "firebase/firestore";
export default {
  name: "WeatherChart",
  props: ["isDay", "isNight", "chartData"],
};
</script>

<style lang="scss" scoped>
.current-weather {
  margin-top: 90px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.7);

  .container {
    margin: 30px 0;
    min-height: 250px;
    position: relative;
    display: flex;
    color: #fff;
  }

  span {
    display: block;
  }

  .weather-info {
    padding-top: 30px;
    flex: 1;

    .city {
      font-size: 24px;
      font-weight: 500;
    }

    .current-temperature {
      margin-top: 40px;
      font-size: 80px;
      font-weight: 600;
    }
  }

  .high-low-temperatures {
    display: flex;
    gap: 16px;

    .high,
    .low {
      display: flex;
      span {
        margin-left: 8px;
      }
    }
  }

  .condition {
    text-transform: capitalize;
    font-size: 24px;
    font-weight: 500;
    margin: 60px 0 8px 0;
  }

  .feels-like {
    font-size: 14px;
    font-weight: 400;
  }

  .weather-icon {
    height: 100%;
    position: absolute;
    right: -180px;
    display: flex;
    align-items: center;
    img {
      width: 366px;
      height: 366px;
    }
  }
}
</style>
