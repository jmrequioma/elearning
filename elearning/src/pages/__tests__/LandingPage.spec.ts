import { describe, it, expect, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { setupTests } from '@/utils/setupTests';

import LandingPage from '../LandingPage.vue';

describe('LandingPage', () => {
	let wrapper: VueWrapper;
	setupTests();

	beforeEach(() => {
		wrapper = mount(LandingPage);
	});

	it('renders the component properly', async () => {
		const container = wrapper.find('.home-page');

		expect(container.element).toBeDefined();
	});
});
