import { shallowMount, createLocalVue } from "@vue/test-utils";
import WeatherChart from "../../src/components/WeatherChart.vue";

const localVue = createLocalVue();
localVue.component("ApexChart", {
  render: () => {},
  methods: {
    renderChart: () => {},
  },
});

describe("WeatherChart", () => {
  it("computes series data correctly from chartData prop", () => {
    const chartDataMock = [
      { current: { temp: 22, feels_like: 21 } },
      { current: { temp: 23, feels_like: 22 } },
      { current: { temp: 24, feels_like: 23 } },
      { current: { temp: 25, feels_like: 24 } },
      { current: { temp: 26, feels_like: 25 } },
    ];

    const wrapper = shallowMount(WeatherChart, {
      localVue,
      propsData: {
        isDay: true,
        isNight: false,
        chartData: chartDataMock,
      },
    });

    // Type assertion to access computed properties
    const vm = wrapper.vm as any;

    expect(vm.series).toEqual([
      {
        name: "Temperatura",
        data: [22, 23, 24, 25, 26],
      },
      {
        name: "Sensação Térmica",
        data: [21, 22, 23, 24, 25],
      },
    ]);
  });
});
