import { describe, it, expect, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import { setupTests } from '@/utils/setupTests';

import AlertModal from '../AlertModal.vue';

describe('AlertModal', () => {
	let wrapper: VueWrapper;
	setupTests();

	beforeEach(() => {
		setActivePinia(createPinia());
		wrapper = mount(AlertModal);
	});

	it('renders the modal', async () => {
		const modal = wrapper.find('.modal');

		expect(modal).toBeDefined();
	});
});
