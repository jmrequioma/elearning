<template>
	<div class="subject-details">
		<div class="subject-top-container">
			<div class="subject-header">
				<div class="subject-header__content">
					<img src="@/assets/media/bookshelf.png" alt="bookshelf-icon" />
					<h6 v-if="!isLoading">{{ headerTitle }}</h6>
				</div>
				<div class="subject-header__content">
					<ui-button class="save-btn" unelevated @click="save">Save</ui-button>
				</div>
			</div>
		</div>
		<div class="subject-details__main">
			<div class="tab">
				<div class="tab__item tab__item--active">Modules</div>
			</div>
			<div class="content">
				<div class="col-2">
					<div class="field">
						<ui-textfield
							id="title"
							v-model="title"
							class="title-field"
							input-type="text"
							outlined
							required
							pattern=".{1,}"
							helper-text-id="title-helper-text"
						>
							Title
						</ui-textfield>
						<ui-textfield-helper
							v-if="titleErrorMsg"
							id="title-helper-text"
							visible
							validMsg
						>
							<small class="alert">{{ titleErrorMsg }}</small>
						</ui-textfield-helper>
					</div>
					<ui-select
						class="field"
						v-model="selectedStatus"
						outlined
						required
						:disabled="isEditSubjectAddModuleRoute"
						fullwidth
						:options="statusOptions"
					>
						Status
					</ui-select>
				</div>
				<div class="col-1">
					<ui-textfield
						id="title"
						v-model="duration"
						class="field"
						input-type="number"
						outlined
						helper-text-id="title-helper-text"
						@keyup.enter="save"
					>
						Duration
					</ui-textfield>
				</div>
				<div class="editor">
					<BaseEditor
						:editor-content="content"
						@handle-content="handleContent"
					/>
				</div>
			</div>
		</div>
		<AlertModal v-if="showSuccessModal">
			<template v-slot:content>
				<p>{{ successMessage }}</p>
			</template>
			<template v-slot:actions>
				<ui-button>Ok</ui-button>
			</template>
		</AlertModal>
	</div>
</template>
<script setup lang="ts">
import { STATUS_OPTIONS } from '@/constants';
import { computed, onMounted, ref } from 'vue';
import { useSubjectsStore } from '@/stores/subject';
import { useCoursesStore } from '@/stores/course';
import { useModulesStore } from '@/stores/module';
import { useContentsStore } from '@/stores/content';
import { useRoute } from 'vue-router';
import type { Course, Module, Subject, Content } from '@/types';
import _ from 'lodash';

import AlertModal from '@/components/AlertModal.vue';
import BaseEditor from '@/components/BaseEditor.vue';

const statusOptions = [...STATUS_OPTIONS];
const title = ref('');
const duration = ref(0);
const selectedStatus = ref('');
const titleErrorMsg = ref('');
const subjectsStore = useSubjectsStore();
const courseStore = useCoursesStore();
const moduleStore = useModulesStore();
const contentStore = useContentsStore();
const fetchedSubject = ref<Subject>();
const fetchedCourse = ref<Course>();
const fetchedModule = ref<Module>();
const fetchedContent = ref<Content>();
const showSuccessModal = ref(false);
const route = useRoute();
const subjectId = ref(0);
const courseId = ref(0);
const moduleId = ref(0);
const content = ref({});
const isLoading = ref(false);

const headerTitle = computed(() => {
	const subjectText = fetchedSubject.value
		? `${fetchedSubject.value?.title}`
		: '';
	const courseText = fetchedCourse.value ? `${fetchedCourse.value?.title}` : '';
	const moduleText = fetchedModule.value ? `${fetchedModule.value?.title}` : '';

	return isEditSubjectAddModuleRoute.value
		? `${subjectText} > ${courseText} > Add modules`
		: `${subjectText} > ${courseText} > ${moduleText}`;
});

const isEditSubjectAddModuleRoute = computed(() => {
	return route.name?.toString() === 'edit-subject-add-module';
});

const isEditSubjectEditModuleRoute = computed(() => {
	return route.name?.toString() === 'edit-subject-edit-module';
});

const successMessage = computed(() => {
	if (isEditSubjectAddModuleRoute.value) {
		return `Successfully created a module named ${title.value}.`;
	} else {
		return 'Module is successfully updated.';
	}
});

onMounted(async () => {
	const id = route.params.subjectId;
	subjectId.value = parseInt(id?.toString());
	// fetch specific subject
	isLoading.value = true;
	await fetchSpecificSubject();
	const courseParamId = route.params.courseId;
	courseId.value = parseInt(courseParamId?.toString());
	await fetchSpecificCourse();
	// if editing a module on edit subject, fetch the module
	if (isEditSubjectEditModuleRoute.value) {
		// fetch module only if editing course
		const moduleParamId = route.params.moduleId;
		moduleId.value = parseInt(moduleParamId?.toString());
		await fetchSpecificModule();
	}
	isLoading.value = false;
});

function validateTitle() {
	if (title.value) {
		titleErrorMsg.value = '';
	} else {
		titleErrorMsg.value = 'Title is required.';
	}
}

async function createModule() {
	const data = {
		courseId: fetchedCourse.value?.id,
		title: title.value,
		duration: duration.value,
		isPublished: false,
	};
	try {
		const res = await moduleStore.createModule(data);
		if (res) {
			// create content
			createContent(res.data.id);
		}
	} catch (error) {
		console.error('creating module failed', error);
		if ((error as Error).message.includes('409')) {
			titleErrorMsg.value = 'Module already exists.';
		}
	}
}

async function createContent(moduleId: number) {
	const data = {
		moduleId: moduleId,
		content: JSON.stringify(content.value),
	};

	try {
		const res = await contentStore.createContent(data);
		if (res) {
			showSuccessModal.value = true;
		}
	} catch (error) {
		console.error('creating content failed', error);
	}
}

function save() {
	validateTitle();
	if (!titleErrorMsg.value) {
		if (isEditSubjectAddModuleRoute.value) {
			createModule();
		} else {
			editModule();
		}
	}
}

async function fetchSpecificSubject() {
	const data = { id: subjectId.value };
	// fetch specific subject
	try {
		const res = await subjectsStore.fetchSubjectDetails(data);
		fetchedSubject.value = res.data;
	} catch (error) {
		console.error('fetching specific subject failed', error);
	}
}

async function fetchSpecificCourse() {
	const data = { id: courseId.value };
	// fetch specific course
	try {
		const res = await courseStore.fetchCourseDetails(data);
		fetchedCourse.value = res.data;
	} catch (error) {
		console.error('fetching specific course failed', error);
	}
}

async function fetchSpecificModule() {
	const data = {
		id: moduleId.value,
	};
	try {
		const res = await moduleStore.fetchModuleDetails(data);
		if (res) {
			fetchedModule.value = res.data;
			// set the appropriate models to display
			title.value = res.data.title;
			selectedStatus.value = res.data.isPublished ? 'Published' : 'Draft';
			duration.value = res.data.duration;
			// display content
			fetchedContent.value = res.data.contents[0];
			content.value = JSON.parse(res.data.contents[0].content);
		}
	} catch (error) {
		console.error('fetching specific module failed', error);
	}
}

async function editContent() {
	try {
		const data = {
			id: fetchedContent.value?.id,
			content: JSON.stringify(content.value),
		};
		const res = await contentStore.updateContent(data);

		if (res) {
			showSuccessModal.value = true;
		}
	} catch (error) {
		console.error('editing specific content failed', error);
	}
}

async function editModule() {
	try {
		const data = {
			id: fetchedModule.value?.id,
			title: title.value,
			isPublished: selectedStatus.value === 'Draft' ? false : true,
			duration: duration.value,
		};
		const res = await moduleStore.updateModule(data);

		if (res) {
			editContent();
		}
	} catch (error) {
		console.error('editing specific module failed', error);
	}
}

function handleContent(contentFromEditor: object) {
	content.value = contentFromEditor;
}
</script>
<style scoped lang="scss">
@import '@/assets/scss/abstract/variables.scss';

.subject-details {
	background-color: $gray-4;
	padding-bottom: 4px;
	height: calc(100vh - 68px);
	box-sizing: border-box;

	&__main {
		border-radius: 10px 10px 0px 0px;
		background-color: $white;
		height: calc(100vh - 216px);
		border-radius: 10px 10px 0px 0px;
		margin: -48px 24px 4px;
		padding-top: 24px;
		box-sizing: border-box;
		position: relative;
	}
}

.subject-top-container {
	min-height: 188px;
	background-color: $accent;
	padding-top: 40px;
	box-sizing: border-box;
}

h6 {
	color: $white;
}

.subject-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	align-content: center;
	padding-left: 24px;
	padding-right: 24px;

	&__content {
		display: flex;
		align-items: center;

		img {
			height: 18px;
			margin-right: 12px;
		}

		.save-btn {
			background-color: $white;
			color: $gray-1;
		}
	}
}

.tab {
	display: flex;
	border-bottom: 1px solid rgba(0, 0, 0, 0.12);
	cursor: pointer;

	&__item {
		color: $gray-1;
		font-weight: 500;
		padding: 4px 32px 12px;

		&--active {
			border-bottom: 1px solid $gray-87;
			margin-bottom: -1px;
		}
	}
}

.content {
	box-sizing: border-box;
	padding: 20px 20px 0;
}

.module {
	width: 100%;
}

.col-2 {
	display: flex;
	justify-content: space-between;
	margin-top: 14px;
	margin-bottom: 20px;
}

.col-1 {
	margin-bottom: 20px;
}

.field {
	width: 45%;
}

.title-field {
	width: 100%;
}

.course-header {
	display: flex;
	justify-content: flex-end;
}

.alt-btn {
	background-color: $accent;
	.capitalize {
		text-transform: capitalize;
	}
}
.course-content {
	margin-top: 24px;
	box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
	border-radius: 6px 6px 0 0;
}

.alert {
	color: $error;
	font-size: 12px;
}
</style>
