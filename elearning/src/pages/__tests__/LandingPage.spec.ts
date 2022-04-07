import { describe, it, expect, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';

import LandingPage from '../LandingPage.vue';

describe('LandingPage', () => {
	let wrapper: VueWrapper;

	beforeEach(() => {
		wrapper = mount(LandingPage);
	});

	it('renders the component properly', async () => {
		const container = wrapper.find('.landing-page');

		expect(container.element).toBeDefined();
	});
});
