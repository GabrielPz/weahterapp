import { shallowMount, createLocalVue } from "@vue/test-utils";
import CurrentWeather from "../../src/components/CurrentWeather.vue";

const localVue = createLocalVue();

describe("CurrentWeather", () => {
  it("renders weather information correctly", () => {
    const currentWeatherMock = {
      name: "Bezerros",
      main: {
        temp: 25,
        temp_max: 30,
        temp_min: 20,
        feels_like: 27,
      },
      weather: [{ description: "light rain" }],
    };

    const wrapper = shallowMount(CurrentWeather, {
      localVue,
      propsData: {
        currentWeather: currentWeatherMock,
        isDay: true,
        isNight: false,
      },
    });

    const normalizeWhitespace = (str: string) =>
      str.replace(/\s+/g, " ").trim();

    expect(wrapper.find(".city").text()).toBe(currentWeatherMock.name);
    expect(wrapper.find(".current-temperature").text()).toContain(
      Math.round(currentWeatherMock.main.temp).toString()
    );
    expect(wrapper.find(".high span").text()).toContain(
      Math.round(currentWeatherMock.main.temp_max).toString()
    );
    expect(wrapper.find(".low span").text()).toContain(
      Math.round(currentWeatherMock.main.temp_min).toString()
    );
    expect(wrapper.find(".condition").text()).toBe(
      currentWeatherMock.weather[0].description
    );
    expect(normalizeWhitespace(wrapper.find(".feels-like").text())).toContain(
      `Sensação Térmica ${Math.round(currentWeatherMock.main.feels_like)}°`
    );
  });
});
