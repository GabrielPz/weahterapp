<template>
  <div class="current-weather">
    <div id="chart">
      <apexchart
        ref="apexChart"
        type="line"
        height="350"
        :options="chartOptions"
        :series="series"
      ></apexchart>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { db } from "../firebase/firebaseinit";
import { collection, getDocs, query, where } from "firebase/firestore";
import ApexCharts from "vue-apexcharts";
import VueApexCharts from "vue-apexcharts";
export default {
  name: "WeatherChart",
  props: ["isDay", "isNight", "chartData"],
  components: {
    apexchart: VueApexCharts,
  },
  computed: {
    series() {
      if (!this.chartData) {
        return [];
      }

      // Assuming chartData is an array of objects for each day
      // Each object contains `temp` and `feels_like` keys among others
      const temps = this.chartData.map((data) => data.current.temp);
      const feelsLike = this.chartData.map((data) => data.current.feels_like);

      return [
        {
          name: "Temperature",
          data: temps,
        },
        {
          name: "Feels Like",
          data: feelsLike,
        },
      ];
    },
  },
  data: () => {
    return {
      chartOptions: {
        chart: {
          height: 350, // Adjust height as needed
          width: 500, // Make the chart responsive
          type: "line",
          dropShadow: {
            enabled: true,
            color: "#000",
            top: 18,
            left: 7,
            blur: 10,
          },
          toolbar: {
            show: false,
          },
        },
        colors: ["#77B6EA", "#545454"],
        dataLabels: {
          enabled: true,
          style: {
            colors: ["#fff"], // White color for data labels
          },
        },
        stroke: {
          curve: "smooth",
        },
        title: {
          text: "Average High & Low Temperature",
          align: "left",
          style: {
            color: "#fff", // White color for the title
          },
        },
        grid: {
          borderColor: "#e7e7e7",
          row: {
            colors: ["#f3f3f3", "transparent"], // Adjust as needed
            opacity: 0.5,
          },
        },
        markers: {
          size: 1,
        },
        xaxis: {
          categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
          title: {
            text: "Month",
            style: {
              color: "#fff", // White color for x-axis title
            },
          },
          labels: {
            style: {
              colors: Array(7).fill("#fff"), // White color for x-axis labels
            },
          },
        },
        yaxis: {
          title: {
            text: "Temperature",
            style: {
              color: "#fff", // White color for y-axis title
            },
          },
          labels: {
            style: {
              colors: ["#fff"], // White color for y-axis labels
            },
          },
        },
        legend: {
          position: "top",
          horizontalAlign: "right",
          floating: true,
          offsetY: -25,
          offsetX: -5,
          labels: {
            colors: ["#fff"], // White color for legend text
          },
        },
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.current-weather {
  margin-top: 90px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.7);
  width: 100%;

  .container {
    margin: 30px 0;
    min-height: 250px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    width: 100%;

    .foreignobject {
      min-width: 800;
    }
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
