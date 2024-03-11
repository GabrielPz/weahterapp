// ModalComponent.spec.ts

import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuetify from "vuetify";
import ModalComponent from "../../src/components/Modal.vue";
import axios from "axios";

jest.mock("axios", () => ({
  get: jest.fn(),
}));

const localVue = createLocalVue();
localVue.use(Vuetify);

describe("ModalComponent", () => {
  let vuetify: any;

  beforeEach(() => {
    vuetify = new Vuetify();
    jest.clearAllMocks();
  });

  it("emits close-modal event after successfully adding a city", async () => {
    const mockData = { data: { name: "Bezerros", main: {}, weather: [{}] } };
    (axios.get as jest.Mock).mockResolvedValue(mockData);

    const wrapper = shallowMount(ModalComponent, {
      localVue,
      vuetify,
      propsData: {
        APIkey: "testApiKey",
      },
    });

    wrapper.setData({ city: "Bezerros" });

    await (wrapper.vm as any).addCity();
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(wrapper.emitted()["close-modal"]).toBeTruthy();
  });

  it("does not call axios.get if city name is empty", async () => {
    const wrapper = shallowMount(ModalComponent, {
      localVue,
      vuetify,
      propsData: {
        APIkey: "testApiKey",
      },
    });

    wrapper.setData({ city: "" });

    await (wrapper.vm as any).addCity();
    expect(axios.get).not.toHaveBeenCalled();
  });

  it("sets loading to false and does not emit close-modal event on API call failure", async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error("API call failed"));

    const wrapper = shallowMount(ModalComponent, {
      localVue,
      vuetify,
      propsData: {
        APIkey: "testApiKey",
      },
    });

    wrapper.setData({ city: "Bezerros" });

    await (wrapper.vm as any).addCity();
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.$data.loading).toBe(false);
    expect(wrapper.emitted()["close-modal"]).toBeFalsy();
  });
});
