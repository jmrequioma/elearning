import { describe, it, expect, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';

import BaseEditor from '../BaseEditor.vue';

describe('BaseEditor', () => {
	let wrapper: VueWrapper;

	beforeEach(() => {
		setActivePinia(createPinia());
		wrapper = mount(BaseEditor, {
			props: {
				editorContent: {
					ops: [
						{ insert: 'Introduction' },
						{ attributes: { header: 1 }, insert: '\\n' },
						{ insert: '\\nhello all\\n\\n\\n\\n' },
					],
				},
			},
		});
	});

	it('renders the editor', async () => {
		const editor = wrapper.find('.quill-container');

		expect(editor).toBeDefined();
	});
});
