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
						selectedTab == 'Module' ? 'tab__item--active' : '',
						'tab__item',
					]"
					@click="selectedTab = 'Module'"
				>
					Module
				</div>
			</div>
			<div class="content">
				<!-- module tab -->
				<div v-if="selectedTab == 'Module'" class="module">
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

import { useRoute, onBeforeRouteLeave } from 'vue-router';
import type { Course, Module } from '@/types';
import _ from 'lodash';
import { useRouter } from 'vue-router';

import AlertModal from '@/components/AlertModal.vue';

const statusOptions = [...STATUS_OPTIONS];
const title = ref('');
const fetchedCourses = ref<Course[]>([]);
const selectedCourse = ref(0);
const selectedStatus = ref('');
const duration = ref(0);
const titleErrorMsg = ref('');
const courseStore = useCoursesStore();
const moduleStore = useModulesStore();
const fetchedModule = ref<Module>();
const showSuccessModal = ref(false);
const route = useRoute();
const moduleId = ref(0);
const selectedTab = ref('Module');
const router = useRouter();
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
			showSuccessModal.value = true;
		}
	} catch (error) {
		console.error('creating module failed', error);
		if ((error as Error).message.includes('409')) {
			titleErrorMsg.value = 'Module already exists.';
		}
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
			showSuccessModal.value = true;
			await fetchSpecificModule();
		}
	} catch (error) {
		console.error('editing specific module failed', error);
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

.module-content {
	margin-top: 24px;
	box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
	border-radius: 6px 6px 0 0;
}

.table-container {
	overflow-y: auto;
	height: 344px;
}

.modules-table {
	padding-top: 24px;
	width: 100%;
	color: $gray-1;
	border-spacing: 0;

	th {
		padding: 12px 32px;
		text-align: left;
		border-bottom: 2px solid $gray-5;
		box-sizing: border-box;

		&:nth-child(1) {
			width: 640px;
		}
	}

	td {
		padding: 12px 12px 12px 32px;
		text-align: left;
		border-bottom: 2px solid $gray-5;
		max-height: 40px;
	}

	.row-action {
		display: flex;
		align-items: center;
		align-content: center;
		justify-content: space-between;
		height: 40px;

		&__menu {
			position: relative;
		}
	}
}

.table-control {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	font-size: 12px;
	border-top: 1px solid $gray-4;
	width: 100%;
	bottom: 0;
	height: 40px;
	box-sizing: border-box;

	p,
	label {
		color: $gray-2;
	}

	&__container {
		display: flex;
		align-items: center;
		align-content: center;
		padding-right: 24px;
		width: 324px;
		justify-content: space-between;
	}

	&__dropdown {
		display: flex;
		align-items: center;
	}

	&__pagination {
		display: flex;
		width: 140px;
		justify-content: space-between;
		color: $gray-2;
		align-items: center;
	}
}

.icon {
	color: $gray-1;
	cursor: pointer;

	&--disabled {
		color: $gray-2;
	}
}

select {
	// A reset of styles, including removing the default dropdown arrow
	appearance: none;
	background-color: transparent;
	border: none;
	padding: 4px 20px 4px 4px;
	margin: 0;
	width: 100%;
	font-family: inherit;
	font-size: 12px;
	border-bottom: 1px solid $gray-1;
	color: $gray-1;
	cursor: inherit;
	line-height: inherit;

	// Stack above custom arrow
	z-index: 1;
	&::-ms-expand {
		display: none;
	}

	// Remove focus outline, will add on alternate element
	outline: none;

	// Custom arrow
	&:not(.select--multiple)::after {
		content: '';
		justify-self: end;
		width: 0.8em;
		height: 0.5em;
		background-color: var(--select-arrow);
		clip-path: polygon(100% 0%, 0 0%, 50% 100%);
	}
}

.select {
	display: grid;
	grid-template-areas: 'select';
	align-items: center;
	font-size: 12px;
	position: relative;

	select {
		grid-area: select;
	}

	padding: 0.25em 0.5em;

	font-size: 1.25rem;
	cursor: pointer;
	line-height: 1.1;

	// Custom arrow
	&::after {
		grid-area: select;
		content: '';
		justify-self: end;
		width: 10px;
		height: 6px;
		background-color: $gray-1;
		clip-path: polygon(100% 0%, 0 0%, 50% 100%);
	}
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
