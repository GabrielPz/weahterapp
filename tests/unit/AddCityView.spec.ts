// AddCity.spec.ts
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vue from 'vue';
import AddCity from '../../src/views/AddCity.vue';
import CityComponent from '../../src/components/City.vue';

Vue.use(Vuetify);

jest.mock('@/components/City.vue', () => ({
  name: 'CityComponent',
  template: '<div></div>',
}));

const localVue = createLocalVue();

describe('AddCity.vue', () => {
  let wrapper: Wrapper<Vue>;
  let vuetify: any;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = shallowMount(AddCity, {
      localVue,
      vuetify,
      propsData: {
        cities: [{ city: 'City Name', currentWeather: { main: { temp: 22 } } }],
        edit: false,
      },
      stubs: {
        CityComponent: true, // Use the mocked CityComponent
      },
    });
  });

  it('renders without crashing', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('emits "edit-city" event when toggleEdit method is called', async () => {
    await (wrapper.vm as any).toggleEdit();
    expect(wrapper.emitted('edit-city')).toBeTruthy();
  });

  it('emits "disable-remove" event when disableRemove method is called', async () => {
    await (wrapper.vm as any).disableRemove();
    expect(wrapper.emitted('disable-remove')).toBeTruthy();
  });

});
