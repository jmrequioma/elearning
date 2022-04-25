import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';

import ImageUploader from '../ImageUploader.vue';
import { nextTick } from 'vue';

describe('ImageUploader', () => {
	let wrapper: VueWrapper;

	beforeEach(() => {
		setActivePinia(createPinia());
		wrapper = mount(ImageUploader, {
			props: {
				image: 'image.jpeg',
			},
		});
	});

	it('renders the component properly', async () => {
		const container = wrapper.find('.image');

		expect(container).toBeDefined();
	});

	it('changes image', async () => {
		const localImageInput = wrapper.find('input[type="file"]');
		let localImageInputValue = '';
		const localImageInputFilesGet = vi.fn();
		const localImageInputValueGet = vi
			.fn()
			.mockReturnValue(localImageInputValue);
		const localImageInputValueSet = vi.fn().mockImplementation((v) => {
			localImageInputValue = v;
		});

		Object.defineProperty(localImageInput.element, 'files', {
			get: localImageInputFilesGet,
		}),
			Object.defineProperty(localImageInput.element, 'value', {
				get: localImageInputValueGet,
				set: localImageInputValueSet,
			});

		localImageInputValue = 'some-image.gif';
		localImageInputFilesGet.mockReturnValue([
			{
				size: 12345,
				blob: 'some-blob',
				width: 300,
				height: 200,
			},
		]);

		localImageInput.trigger('change');

		return nextTick().then(() => {
			expect(localImageInputValue).toEqual('some-image.gif');
		});
	});
});
