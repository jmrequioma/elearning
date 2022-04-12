import { describe, it, expect, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';

import DropdownMenu from '../DropdownMenu.vue';

describe('DropdownMenu', () => {
	let wrapper: VueWrapper;

	beforeEach(() => {
		setActivePinia(createPinia());
		wrapper = mount(DropdownMenu, {
			props: {
				items: ['Publish', 'Edit', 'Delete'],
			},
		});
	});

	it('renders the menu', async () => {
		const menu = wrapper.find('ui-menu');

		expect(wrapper.html()).toContain('Publish');
		expect(wrapper.html()).toContain('Edit');
		expect(wrapper.html()).toContain('Delete');
		expect(menu).toBeDefined();
	});

	it('emits an event', async () => {
		const menuItem = wrapper.find('ui-menuitem');

		// click the menu item
		menuItem.trigger('click');
		const emitted = wrapper.emitted('handleAction');

		expect(wrapper.emitted()).toHaveProperty('handleAction');
		expect(emitted).toHaveLength(1);
		expect(emitted ? emitted[0] : '').toContain('Publish');
	});
});
