// CityComponent.spec.ts

import { shallowMount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';
import CityComponent from '../../src/components/City.vue';
import { db } from "../../src/firebase/firebaseinit";

jest.mock("@/firebase/firebaseinit", () => ({
  db: {
    collection: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      getDocs: jest.fn().mockResolvedValue({
        forEach: jest.fn().mockImplementation((callback) => {
          callback({ id: "testDocId", data: () => ({ city: "Test City" }) });
        })
      }),
    })),
    doc: jest.fn(() => ({
      deleteDoc: jest.fn().mockResolvedValue({})
    })),
  },
}));

const localVue = createLocalVue();
localVue.use(VueRouter);
const router = new VueRouter();

describe('CityComponent', () => {
  let vuetify: any;

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it('renders correctly', () => {
    const wrapper = shallowMount(CityComponent, {
      localVue,
      vuetify,
      router,
      propsData: {
        city: { city: 'Test City', currentWeather: { main: { temp: 25 }, weather: [{ icon: '01d' }] } },
        edit: true,
      },
    });

    expect(wrapper.text()).toContain('Test City');
  });
});
