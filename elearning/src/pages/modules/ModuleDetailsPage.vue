<template>
	<div class="module-details">
		<div class="module-top-container">
			<div class="module-header">
				<div class="module-header__content">
					<img src="@/assets/media/bookshelf.png" alt="bookshelf-icon" />
					<h6 v-if="!isLoading">{{ headerTitle }}</h6>
				</div>
				<div class="module-header__content">
					<ui-button class="save-btn" unelevated @click="save">Save</ui-button>
				</div>
			</div>
		</div>
		<div class="module-details__main">
			<div class="tab">
				<div
					:class="[
						selectedTab === 'Module' ? 'tab__item--active' : '',
						'tab__item',
					]"
					@click="selectedTab = 'Module'"
				>
					Module
				</div>
			</div>
			<div class="content">
				<!-- module tab -->
				<div v-if="selectedTab === 'Module'" class="module">
					<div class="col-2">
						<div class="field">
							<ui-textfield
								id="title"
								v-model="title"
								class="full-field"
								input-type="text"
								outlined
								required
								pattern=".{1,}"
								helper-text-id="title-helper-text"
								@keyup.enter="save"
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
							v-model="selectedCourse"
							outlined
							required
							fullwidth
							:options="fetchedCoursesOptions"
						>
							Course
						</ui-select>
					</div>
					<div class="col-2">
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
						<ui-select
							class="field"
							v-model="selectedStatus"
							outlined
							required
							:disabled="isAddModuleRoute"
							fullwidth
							:options="statusOptions"
						>
							Status
						</ui-select>
					</div>
					<div class="col-1">
						<div class="editor">
							<BaseEditor
								:editor-content="content"
								@handle-content="handleContent"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
		<AlertModal v-if="showSuccessModal">
			<template v-slot:content>
				<p>{{ successMessage }}</p>
			</template>
			<template v-slot:actions>
				<ui-button @click="returnToModules">Ok</ui-button>
			</template>
		</AlertModal>
		<router-view />
	</div>
</template>
<script setup lang="ts">
import { STATUS_OPTIONS } from '@/constants';
import { computed, onMounted, ref } from 'vue';
import { useCoursesStore } from '@/stores/course';
import { useModulesStore } from '@/stores/module';
import { useContentsStore } from '@/stores/content';

import { useRoute, onBeforeRouteLeave } from 'vue-router';
import type { Content, Course, Module } from '@/types';
import { useRouter } from 'vue-router';

import AlertModal from '@/components/AlertModal.vue';
import BaseEditor from '@/components/BaseEditor.vue';

const statusOptions = [...STATUS_OPTIONS];
const title = ref('');
const fetchedCourses = ref<Course[]>([]);
const selectedCourse = ref(0);
const selectedStatus = ref('');
const duration = ref(0);
const titleErrorMsg = ref('');
const courseStore = useCoursesStore();
const moduleStore = useModulesStore();
const contentStore = useContentsStore();
const fetchedModule = ref<Module>();
const fetchedContent = ref<Content>();
const showSuccessModal = ref(false);
const route = useRoute();
const moduleId = ref(0);
const selectedTab = ref('Module');
const router = useRouter();
const content = ref({});
const isLoading = ref(false);

const headerTitle = computed(() => {
	if (isAddModuleRoute.value) {
		return 'Add a module';
	} else {
		return `${fetchedModule.value?.title}`;
	}
});

const isAddModuleRoute = computed(() => {
	return route.name?.toString() === 'add-module';
});

const successMessage = computed(() => {
	if (isAddModuleRoute.value) {
		return `Successfully created a module named ${title.value}.`;
	} else {
		return 'Module is successfully updated.';
	}
});

const unsavedChanges = computed(() => {
	const status = selectedStatus.value === 'Draft' ? false : true;
	if (!isAddModuleRoute.value) {
		return (
			title.value != fetchedModule.value?.title ||
			status != fetchedModule.value?.isPublished ||
			selectedCourse.value != fetchedModule.value?.courseId ||
			duration.value != fetchedModule.value?.duration
		);
	}
	return false;
});

const fetchedCoursesOptions = computed(() => {
	const options: Array<object> = [];
	fetchedCourses.value.forEach((course) => {
		const option = {
			label: course.title,
			value: course.id,
		};
		options.push(option);
	});
	return options;
});

onMounted(async () => {
	// check if page is for adding or editing
	isLoading.value = true;
	if (!isAddModuleRoute?.value) {
		const id = route.params.id;
		moduleId.value = parseInt(id?.toString());
		// fetch specific subject
		await fetchSpecificModule();
	}
	// fetch courses for dropdown
	fetchCourses();
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
	try {
		const res = await moduleStore.createModule({
			title: title.value,
			courseId: selectedCourse.value,
			duration: duration.value,
			isPublished: false,
		});
		if (res) {
			// create content
			await createContent(res.data.id);
			showSuccessModal.value = true;
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
		if (isAddModuleRoute.value) {
			createModule();
		} else {
			editModule();
		}
	}
}

async function fetchSpecificModule() {
	const data = { id: moduleId.value };
	// fetch specific subject
	try {
		const res = await moduleStore.fetchModuleDetails(data);
		fetchedModule.value = res.data;
		// set the text field models
		title.value = res.data.title;
		selectedCourse.value = res.data.courseId;
		selectedStatus.value = res.data.isPublished ? 'Published' : 'Draft';
		duration.value = res.data.duration;
		// display content
		fetchedContent.value = res.data.contents[0];
		content.value = JSON.parse(res.data.contents[0].content);
	} catch (error) {
		console.error('fetching specific module failed', error);
	}
}

async function editModule() {
	try {
		let data = {
			id: fetchedModule.value?.id,
			title: title.value,
			courseId: selectedCourse.value,
			isPublished: selectedStatus.value === 'Draft' ? false : true,
			duration: duration.value,
		};
		const res = await moduleStore.updateModule(data);
		if (res) {
			await editContent();
			await fetchSpecificModule();
		}
	} catch (error) {
		console.error('editing specific module failed', error);
	}
}

async function editContent() {
	try {
		let data = {
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

function returnToModules() {
	if (isAddModuleRoute.value) {
		router.push({
			name: 'modules',
		});
	} else {
		showSuccessModal.value = false;
	}
}

async function fetchCourses() {
	// fetch courses to populate subject dropdown
	try {
		const res = await courseStore.fetchCourses({ full: true });
		if (res) {
			fetchedCourses.value = res.data;
		}
	} catch (error) {
		console.error('fetching courses for dropdown failed.', error);
	}
}

function handleContent(contentFromEditor: object) {
	content.value = contentFromEditor;
}

onBeforeRouteLeave(() => {
	if (!showSuccessModal.value && unsavedChanges.value) {
		const answer = window.confirm(
			'Do you really want to leave? you have unsaved changes!'
		);
		// cancel the navigation and stay on the same page
		if (!answer) return false;
	}
});
</script>
<style scoped lang="scss">
@import '@/assets/scss/abstract/variables.scss';

.module-details {
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

.module-top-container {
	min-height: 188px;
	background-color: $accent;
	padding-top: 40px;
	box-sizing: border-box;
}

h6 {
	color: $white;
}

.module-header {
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

.field {
	width: 45%;
}

.full-field {
	width: 100%;
}

.alert {
	color: $error;
	font-size: 12px;
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
</style>
