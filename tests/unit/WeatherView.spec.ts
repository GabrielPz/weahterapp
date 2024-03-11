import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vue from "vue";
import Vuetify from "vuetify";
import WeatherView from "../../src/views/Weather.vue";
import axios from "axios";

Vue.use(Vuetify);

jest.mock("axios");

const mockAxios = axios as jest.Mocked<typeof axios>;

const localVue = createLocalVue();

describe("WeatherView.vue", () => {
  let vuetify: any;

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it("renders without crashing", () => {
    const wrapper = shallowMount(WeatherView, {
      localVue,
      vuetify,
      propsData: { APIkey: "testKey", isDay: true, isNight: false },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it("fetches weather data successfully", async () => {
    mockAxios.get.mockResolvedValue({
      data: {
        current: { temp: 22, weather: [{ description: "Sunny" }] },
        hourly: [],
      },
    });

    const wrapper = shallowMount(WeatherView, {
      localVue,
      vuetify,
      propsData: { APIkey: "testKey", isDay: true, isNight: false },
    });

    await (wrapper.vm as any).getWeather();

    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.$data.forecast).toHaveProperty("current");
    expect(wrapper.vm.$data.forecast.current.temp).toBe(22);
  });
});
