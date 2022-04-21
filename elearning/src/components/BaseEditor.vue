<template>
	<div class="quill-container">
		<QuillEditor
			v-model:content="content"
			:toolbar="[
				[{ header: [1, 2, 3, 4, 5, 6, false] }],
				['bold', 'italic', 'underline'],
				[{ color: [] }],
				[{ align: [] }],
				[{ list: 'ordered' }, { list: 'bullet' }],
				['link'],
				['image', 'video'],
			]"
			theme="bubble"
		>
		</QuillEditor>
	</div>
</template>
<script setup lang="ts">
import { Delta, QuillEditor } from '@vueup/vue-quill';
import { onMounted, ref, watch } from 'vue';
import '@vueup/vue-quill/dist/vue-quill.bubble.css';

const props = defineProps({
	editorContent: Object,
});

const content = ref<Delta>();
const emit = defineEmits(['handleContent']);

onMounted(() => {
	// set props to a ref
	content.value = props.editorContent as Delta;
});

watch(content, (newContent) => {
	emit('handleContent', newContent);
});
</script>
<style scoped lang="scss">
@import '@/assets/scss/abstract/variables.scss';

:deep(.ql-tooltip) {
	border-radius: unset;
}

:deep(.ql-toolbar) {
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

:deep(.ql-bubble .ql-tooltip) {
	background-color: $white;
	color: $black;
}

:deep(.ql-bubble .ql-editor) {
	box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
	border: unset;
	height: 280px;
}

:deep(.ql-bubble .ql-picker-options) {
	background-color: $white;
	box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
}

:deep(.ql-bubble .ql-picker.ql-expanded .ql-picker-label .ql-stroke) {
	stroke: $black;
}

:deep(.ql-bubble .ql-button) {
	color: $black;
}

:deep(.ql-bubble .ql-picker) {
	color: $black;
}

:deep(.ql-bubble .ql-toolbar .ql-picker-item.ql-selected, .ql-bubble
		.ql-toolbar
		.ql-picker-item:hover, .ql-bubble
		.ql-toolbar
		.ql-picker-label.ql-active, .ql-bubble
		.ql-toolbar
		.ql-picker-label:hover, .ql-bubble .ql-toolbar button.ql-active, .ql-bubble
		.ql-toolbar
		button:focus, .ql-bubble .ql-toolbar button:hover, .ql-bubble.ql-toolbar
		.ql-picker-item.ql-selected, .ql-bubble.ql-toolbar
		.ql-picker-item:hover, .ql-bubble.ql-toolbar
		.ql-picker-label.ql-active, .ql-bubble.ql-toolbar
		.ql-picker-label:hover, .ql-bubble.ql-toolbar
		button.ql-active, .ql-bubble.ql-toolbar button:focus, .ql-bubble.ql-toolbar
		button:hover) {
	color: $black;
}

:deep(.ql-bubble .ql-tooltip-editor input[type='text']) {
	color: $black;
}

:deep(.ql-bubble .ql-toolbar .ql-picker-item.ql-selected .ql-stroke, .ql-bubble
		.ql-toolbar
		.ql-picker-item.ql-selected
		.ql-stroke-miter, .ql-bubble
		.ql-toolbar
		.ql-picker-item:hover
		.ql-stroke, .ql-bubble
		.ql-toolbar
		.ql-picker-item:hover
		.ql-stroke-miter, .ql-bubble
		.ql-toolbar
		.ql-picker-label.ql-active
		.ql-stroke, .ql-bubble
		.ql-toolbar
		.ql-picker-label.ql-active
		.ql-stroke-miter, .ql-bubble
		.ql-toolbar
		.ql-picker-label:hover
		.ql-stroke, .ql-bubble
		.ql-toolbar
		.ql-picker-label:hover
		.ql-stroke-miter, .ql-bubble
		.ql-toolbar
		button.ql-active
		.ql-stroke, .ql-bubble
		.ql-toolbar
		button.ql-active
		.ql-stroke-miter, .ql-bubble .ql-toolbar button:focus .ql-stroke, .ql-bubble
		.ql-toolbar
		button:focus
		.ql-stroke-miter, .ql-bubble .ql-toolbar button:hover .ql-stroke, .ql-bubble
		.ql-toolbar
		button:hover
		.ql-stroke-miter, .ql-bubble.ql-toolbar
		.ql-picker-item.ql-selected
		.ql-stroke, .ql-bubble.ql-toolbar
		.ql-picker-item.ql-selected
		.ql-stroke-miter, .ql-bubble.ql-toolbar
		.ql-picker-item:hover
		.ql-stroke, .ql-bubble.ql-toolbar
		.ql-picker-item:hover
		.ql-stroke-miter, .ql-bubble.ql-toolbar
		.ql-picker-label.ql-active
		.ql-stroke, .ql-bubble.ql-toolbar
		.ql-picker-label.ql-active
		.ql-stroke-miter, .ql-bubble.ql-toolbar
		.ql-picker-label:hover
		.ql-stroke, .ql-bubble.ql-toolbar
		.ql-picker-label:hover
		.ql-stroke-miter, .ql-bubble.ql-toolbar
		button.ql-active
		.ql-stroke, .ql-bubble.ql-toolbar
		button.ql-active
		.ql-stroke-miter, .ql-bubble.ql-toolbar
		button:focus
		.ql-stroke, .ql-bubble.ql-toolbar
		button:focus
		.ql-stroke-miter, .ql-bubble.ql-toolbar
		button:hover
		.ql-stroke, .ql-bubble.ql-toolbar button:hover .ql-stroke-miter) {
	stroke: $black;
	color: $black;
}

:deep(.ql-bubble .ql-toolbar button.ql-active) {
	color: $black;
}

:deep(.ql-bubble .ql-toolbar .ql-picker-label.ql-active) {
	color: $black;
}

:deep(.ql-bubble .ql-toolbar button.ql-active .ql-stroke) {
	stroke: $black;
}

:deep(.ql-bubble .ql-toolbar button:hover .ql-stroke) {
	stroke: $black;
}

:deep(.ql-bubble .ql-toolbar .ql-picker-label:hover .ql-stroke) {
	stroke: $black;
}

:deep(.ql-bubble .ql-toolbar .ql-picker-label:hover) {
	color: $black;
}

:deep(.ql-tooltip-arrow) {
	display: none;
}

:deep(.ql-bubble .ql-toolbar button.ql-active .ql-fill) {
	fill: $black;
}

:deep(.ql-bubble .ql-picker-options .ql-picker-item:hover .ql-stroke) {
	stroke: $black;
}

:deep(.ql-bubble .ql-icon-picker .ql-picker-item:hover) {
	color: $black;
}

:deep(.ql-picker-item:hover) {
	color: $black;
}

:deep(.ql-bubble
		.ql-picker.ql-expanded
		.ql-picker-options
		.ql-picker-item:hover) {
	color: $black;
}

:deep(.ql-bubble .ql-toolbar .ql-picker-label.ql-active .ql-stroke) {
	stroke: $black;
}

:deep(.ql-bubble .ql-picker-label) {
	color: $black;
}
:deep(.ql-picker-item:hover) {
	color: $black;
}
:deep(.ql-bubble .ql-toolbar button:hover .ql-fill) {
	fill: $black;
}
:deep(.ql-bubble .ql-toolbar button:hover) {
	color: $black;
}
:deep(.ql-bubble .ql-transparent) {
	opacity: unset;
}
:deep(.ql-bubble .ql-stroke) {
	stroke: $black;
}

:deep(.ql-bubble .ql-fill) {
	fill: $black;
}
</style>
