<template>
	<div class="page">
		<aside>
			<div class="module-list">
				<div
					v-for="(m, index) in fetchedEnrollment?.course?.modules"
					:key="m.id"
					@click="selectModule(m)"
					:class="[
						isActiveModuleItem(m) ? 'module-list__item--active' : '',
						'module-list__item',
					]"
				>
					<div class="sequence">
						{{ index + 1 }}
					</div>
					<div class="title">
						{{ m?.title }}
					</div>
				</div>
			</div>
		</aside>
		<div class="main">
			<div class="secondary-bar">
				<ui-icon-button @click="router.push({ name: 'my-courses' })"
					>arrow_backward</ui-icon-button
				>
				<h6 class="header">{{ fetchedEnrollment?.course?.title }}</h6>
			</div>
			<div class="editor">
				<BaseEditor :editor-content="content" :disabled="true" />
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import BaseEditor from '@/components/BaseEditor.vue';
import { useEnrollmentsStore } from '@/stores/enrollment';
import { useRoute, useRouter } from 'vue-router';
import type { Enrollment, Module } from '@/types';

const fetchedEnrollment = ref<Enrollment>();
const currentModule = ref<Module>();
const enrollmentStore = useEnrollmentsStore();
const route = useRoute();
const router = useRouter();

const enrollmentId = computed(() => {
	const id = route.params.id;
	return parseInt(id?.toString());
});

const content = computed(() => {
	// return the content of the currently selected module
	return currentModule.value?.contents
		? JSON.parse(currentModule.value?.contents[0].content)
		: '';
});

onMounted(async () => {
	await fetchSpecificEnrollment();
});

async function fetchSpecificEnrollment() {
	try {
		const res = await enrollmentStore.fetchEnrollmentDetails({
			id: enrollmentId.value,
		});
		fetchedEnrollment.value = res.data;
		// set current module to first module found
		currentModule.value = res.data.course.modules[0];
	} catch (error) {
		console.error('fetching specific course failed', error);
	}
}

function isActiveModuleItem(m: Module) {
	return m.id === currentModule.value?.id;
}

function selectModule(m: Module) {
	currentModule.value = m;
}
</script>
<style scoped lang="scss">
@import '@/assets/scss/abstract/variables.scss';
.page {
	display: flex;
}
.module-list {
	box-sizing: border-box;
	padding-top: 36px;
	width: 228px;
	height: calc(100vh - 68px);
	background-color: $gray-4;

	&__item {
		display: flex;
		gap: 8px;
		align-items: center;
		padding: 16px;
		position: relative;
		cursor: pointer;

		.sequence {
			display: flex;
			align-content: center;
			align-items: center;
			justify-content: center;
			border: 1px solid #bdbdbd;
			border-radius: 50%;
			width: 25px;
			height: 25px;
			font-size: 12px;
			color: $gray-6;
		}

		&:nth-child(even):before {
			content: '';
			position: absolute;
			left: 5px;
			top: -17px;
			bottom: 43px;
			transform: translateX(1.5rem);
			width: 1px;
			background-color: #bdbdbd;
			z-index: 1;
		}

		&:nth-child(even):after {
			content: '';
			position: absolute;
			left: 5px;
			top: 43px;
			bottom: -17px;
			transform: translateX(1.5rem);
			width: 1px;
			background-color: #bdbdbd;
			z-index: 1;
		}

		&:last-child:after {
			all: unset;
		}

		&--active {
			background-color: $accent-50;

			.sequence {
				border: 3px solid $accent;
			}

			&:nth-child(even):before {
				bottom: 47px;
			}

			&:nth-child(even):after {
				top: 47px;
			}
		}
	}

	.title {
		font-size: 14px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 152px;
		color: $gray-6;
	}
}

.main {
	width: 100%;
	height: calc(100vh - 68px);
	background-color: $gray-5;
}
.secondary-bar {
	height: 64px;
	padding-left: 16px;
	background-color: $accent;
	display: flex;
	column-gap: 12px;
	color: $white;
	align-items: center;
}

.header {
	color: $white;
}

.editor {
	height: calc(100vh - 172px);
	margin: 40px 80px 0;
}

:deep(.quill-container) {
	height: 100%;
}
:deep(.ql-bubble .ql-editor) {
	background-color: $white;
	height: 100%;
	border-radius: 8px 8px 0 0;
	overflow-y: auto;
}
</style>
