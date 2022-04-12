import { describe, it, expect, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';

import DropdownMenu from '../DropdownMenu.vue';

describe('DropdownMenu', () => {
	let wrapper: VueWrapper;

	beforeEach(() => {
		setActivePinia(createPinia());
		wrapper = mount(DropdownMenu);
	});

	it('renders the menu', async () => {
		const menu = wrapper.find('ui-menu');

		expect(menu).toBeDefined();
	});
});
