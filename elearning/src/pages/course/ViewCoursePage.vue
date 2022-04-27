<template>
	<div class="page">
		<aside>
			<div class="module-list">
				<div
					v-for="(m, index) in fetchedEnrollment?.course.modules"
					:key="m.id"
					class="module-list__item"
				>
					<div class="sequence">
						{{ index + 1 }}
					</div>
					<div class="title">
						{{ m.title }}
					</div>
				</div>
			</div>
		</aside>
		<div class="main">
			<div class="secondary-bar">
				<ui-icon-button>arrow_backward</ui-icon-button>
				<h6 class="header">{{ fetchedEnrollment?.course.title }}</h6>
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
import { useCoursesStore } from '@/stores/course';
import { useRoute } from 'vue-router';
import type { Course, Enrollment, Module } from '@/types';

const fetchedEnrollment = ref<Enrollment>();
const courseStore = useCoursesStore();
const currentModule = ref<Module>();
const enrollmentStore = useEnrollmentsStore();
const route = useRoute();

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

// async function fetchSpecificCourse() {
// 	try {
// 		const res = await courseStore.fetchCourseDetails({ id: courseId.value });
// 		fetchedCourse.value = res.data;
// 	} catch (error) {
// 		console.error('fetching specific course failed', error);
// 	}
// }
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
		padding-bottom: 2rem;
		padding-left: 16px;
		position: relative;

		&:not(:last-child):after {
			content: '';
			position: absolute;
			left: 5px;
			top: 27px;
			bottom: 0;
			transform: translateX(1.5rem);
			width: 1px;
			background-color: #bdbdbd;
		}
	}

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
	width: 100%;
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
