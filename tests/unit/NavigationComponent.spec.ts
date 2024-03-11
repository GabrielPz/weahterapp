// NavigationComponent.spec.ts

import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';
import NavigationComponent from '../../src/components/Navigation.vue';

// Create a local Vue instance to use Vuetify
const localVue = createLocalVue();

describe('NavigationComponent', () => {
  let vuetify: any;
  // Save the original window.location
  const originalLocation = window.location;

  beforeEach(() => {
    vuetify = new Vuetify();

    // Mock just the reload function on the location object
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { reload: jest.fn() },
    });
  });

  afterEach(() => {
    // Restore the original window.location after each test
    window.location = originalLocation;
  });

  it('emits add-city event when addCity method is called', async () => {
    const wrapper = shallowMount(NavigationComponent, {
      localVue,
      vuetify,
      propsData: {
        isHomeView: true,
        isDay: false,
        isNight: false,
      },
    });

    await (wrapper.vm as any).addCity();
    expect(wrapper.emitted()['add-city']).toBeTruthy();
  });

  it('emits edit-city event when editCity method is called', async () => {
    const wrapper = shallowMount(NavigationComponent, {
      localVue,
      vuetify,
      propsData: {
        isHomeView: true,
        isDay: false,
        isNight: false,
      },
    });

    await (wrapper.vm as any).editCity();
    expect(wrapper.emitted()['edit-city']).toBeTruthy();
  });

  it('calls window.location.reload when reloadApp method is called', async () => {
    const wrapper = shallowMount(NavigationComponent, {
      localVue,
      vuetify,
      propsData: {
        isHomeView: true,
        isDay: false,
        isNight: false,
      },
    });

    await (wrapper.vm as any).reloadApp();
    expect(window.location.reload).toHaveBeenCalled();
  });
});