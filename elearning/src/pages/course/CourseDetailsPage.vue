<template>
	<div class="course-details">
		<div class="course-top-container">
			<div class="course-header">
				<div class="course-header__content">
					<img src="@/assets/media/bookshelf.png" alt="bookshelf-icon" />
					<h6 v-if="!isLoading">{{ headerTitle }}</h6>
				</div>
				<div class="course-header__content">
					<ui-button class="save-btn" unelevated @click="save">Save</ui-button>
				</div>
			</div>
		</div>
		<div class="course-details__main">
			<div class="tab">
				<div
					:class="[
						selectedTab == 'Course' ? 'tab__item--active' : '',
						'tab__item',
					]"
					@click="selectedTab = 'Course'"
				>
					Course
				</div>
				<div
					:class="[
						selectedTab == 'Modules' ? 'tab__item--active' : '',
						'tab__item',
					]"
					@click="selectedTab = 'Modules'"
				>
					Modules
				</div>
			</div>
			<div class="content">
				<!-- course tab -->
				<div v-if="selectedTab == 'Course'" class="course">
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
							v-model="selectedSubject"
							outlined
							required
							fullwidth
							:options="fetchedSubjectsOptions"
						>
							Subject
						</ui-select>
					</div>
					<div class="col-2">
						<ui-textfield
							id="author"
							v-model="author"
							class="field"
							input-type="text"
							outlined
							required
							disabled
							pattern=".{1,}"
							helper-text-id="title-helper-text"
							@keyup.enter="save"
						>
							Author
						</ui-textfield>
						<ui-textfield-helper
							v-if="titleErrorMsg"
							id="title-helper-text"
							visible
							validMsg
						>
							<small class="alert">{{ titleErrorMsg }}</small>
						</ui-textfield-helper>
						<ui-select
							class="field"
							v-model="selectedStatus"
							outlined
							required
							:disabled="isAddCourseRoute"
							fullwidth
							:options="statusOptions"
						>
							Status
						</ui-select>
					</div>
					<div class="col-1">
						<ui-textfield
							v-model="desc"
							class="full-field"
							input-type="text"
							outlined
							@keyup.enter="save"
						>
							Course Description
						</ui-textfield>
					</div>
					<ImageUploader
						:image="uploadedImage"
						@handle-file-change="handleFileChange"
					/>
				</div>
				<!-- modules tab -->
				<div v-else-if="selectedTab == 'Modules'" class="module">
					<div class="module-content">
						<div class="table-container">
							<table class="modules-table">
								<tr>
									<th>Title</th>
									<th>Duration</th>
									<th>Status</th>
								</tr>
								<tr
									v-for="m in modules"
									:key="m.id"
									@click="selectedModule = m"
								>
									<td>{{ m.title }}</td>
									<td>{{ m.duration }} min</td>
									<td class="row-action">
										<template v-if="m.isPublished"> Published </template>
										<template v-else> Draft </template>
									</td>
								</tr>
							</table>
						</div>
						<div class="table-control">
							<div class="table-control__container">
								<div class="table-control__dropdown">
									<label for="items">Items per page:</label>
									<div class="select">
										<select name="items" v-model="selectedLimit">
											<option
												v-for="option in options"
												:value="option"
												:key="option"
											>
												{{ option }}
											</option>
										</select>
									</div>
								</div>
								<div class="table-control__pagination">
									{{ currStart }} - {{ currTotal }} of
									{{ fetchedCourse ? fetchedCourse.modules.length : 0 }}
									<ui-icon
										:class="[prevIsDisabled ? 'icon--disabled' : '', 'icon']"
										@click="goPrev()"
										>navigate_before</ui-icon
									>
									<ui-icon
										:class="[nextIsDisabled ? 'icon--disabled' : '', 'icon']"
										@click="goNext()"
										>navigate_next</ui-icon
									>
								</div>
							</div>
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
				<ui-button @click="returnToCourses">Ok</ui-button>
			</template>
		</AlertModal>
		<router-view />
	</div>
</template>
<script setup lang="ts">
import { STATUS_OPTIONS } from '@/constants';
import { computed, onMounted, ref, watch } from 'vue';
import { useSubjectsStore } from '@/stores/subject';
import { useCoursesStore } from '@/stores/course';
import { useModulesStore } from '@/stores/module';
import { useAuthStore } from '@/stores/auth';
import { usePagination } from '@/composables/pagination';

import { useRoute, onBeforeRouteLeave } from 'vue-router';
import type { Course, Subject, Module } from '@/types';
import _ from 'lodash';
import { useRouter } from 'vue-router';

import ImageUploader from '@/components/ImageUploader.vue';
import AlertModal from '@/components/AlertModal.vue';

const statusOptions = [...STATUS_OPTIONS];
const title = ref('');
const fetchedSubjects = ref<Subject[]>([]);
const selectedSubject = ref(0);
const selectedStatus = ref('');
const desc = ref('');
const titleErrorMsg = ref('');
const subjectStore = useSubjectsStore();
const courseStore = useCoursesStore();
const moduleStore = useModulesStore();
const authStore = useAuthStore();
const uploadedImage = ref('');
const fetchedCourse = ref<Course>();
const modules = ref<Module[]>([]);
const showSuccessModal = ref(false);
const route = useRoute();
const courseId = ref(0);
const selectedTab = ref('Course');
const totalModuleCount = ref(0);
const selectedModule = ref<Module>();
const router = useRouter();
const isLoading = ref(false);

const {
	options,
	selectedLimit,
	currPage,
	currTotal,
	currStart,
	prevIsDisabled,
	nextIsDisabled,
	goPrev,
	goNext,
} = usePagination(totalModuleCount);

watch(
	currPage,
	_.debounce(() => {
		fetchModules();
	}, 500)
);

const headerTitle = computed(() => {
	if (isAddCourseRoute.value) {
		return 'Add a course';
	} else {
		return `${fetchedCourse.value?.subject?.title} > ${fetchedCourse.value?.title}`;
	}
});

const isAddCourseRoute = computed(() => {
	return route.name?.toString() === 'add-course';
});

const successMessage = computed(() => {
	if (isAddCourseRoute.value) {
		return `Successfully created a course named ${title.value}.`;
	} else {
		return 'Course is successfully updated.';
	}
});

const unsavedChanges = computed(() => {
	const status = selectedStatus.value === 'Draft' ? false : true;
	if (!isAddCourseRoute.value) {
		return (
			title.value != fetchedCourse.value?.title ||
			status != fetchedCourse.value?.isPublished ||
			selectedSubject.value != fetchedCourse.value?.subjectId ||
			desc.value != fetchedCourse.value?.description ||
			uploadedImage.value != fetchedCourse.value?.icon
		);
	}
	return false;
});

const author = computed(() => {
	const user = authStore.loggedInUser;
	return user ? `${user.firstName} ${user.lastName}` : '';
});

const fetchedSubjectsOptions = computed(() => {
	const options: Array<object> = [];
	fetchedSubjects.value.forEach((subject) => {
		const option = {
			label: subject.title,
			value: subject.id,
		};
		options.push(option);
	});
	return options;
});

onMounted(async () => {
	// check if page is for adding or editing
	isLoading.value = true;
	if (!isAddCourseRoute?.value) {
		const id = route.params.id;
		courseId.value = parseInt(id?.toString());
		// fetch specific subject
		await fetchSpecificCourse();
		// fetch related courses
		fetchModules();
	}
	// fetch subjects for dropdown
	fetchSubjects();
	isLoading.value = false;
});

function validateTitle() {
	if (title.value) {
		titleErrorMsg.value = '';
	} else {
		titleErrorMsg.value = 'Title is required.';
	}
}

async function createCourse() {
	try {
		const res = await courseStore.createCourse({
			title: title.value,
			subjectId: selectedSubject.value,
		});
		if (res) {
			showSuccessModal.value = true;
		}
	} catch (error) {
		console.error('creating course failed', error);
		if ((error as Error).message.includes('409')) {
			titleErrorMsg.value = 'Course already exists.';
		}
	}
}

function save() {
	validateTitle();
	if (!titleErrorMsg.value) {
		if (isAddCourseRoute.value) {
			createCourse();
		} else {
			editCourse();
		}
	}
}

async function fetchSpecificCourse() {
	const data = { id: courseId.value };
	// fetch specific subject
	try {
		const res = await courseStore.fetchCourseDetails(data);
		fetchedCourse.value = res.data;
		// set the text field models
		title.value = res.data.title;
		selectedSubject.value = res.data.subjectId;
		selectedStatus.value = res.data.isPublished ? 'Published' : 'Draft';
		desc.value = res.data.description;
		uploadedImage.value = res.data.icon;
	} catch (error) {
		console.error('fetching specific course failed', error);
	}
}

async function fetchModules() {
	const data = {
		courseId: fetchedCourse.value?.id,
		page: currPage.value,
		limit: selectedLimit.value,
	};
	try {
		const res = await moduleStore.fetchModules(data);
		if (res) {
			modules.value = res.data.data;
		}
	} catch (error) {
		console.error('fetching modules failed', error);
	}
}

async function editCourse() {
	try {
		let data = {
			id: fetchedCourse.value?.id,
			title: title.value,
			subjectId: selectedSubject.value,
			isPublished: selectedStatus.value === 'Draft' ? false : true,
			description: desc.value,
		};
		const res = await courseStore.updateCourse(data);
		if (res) {
			showSuccessModal.value = true;
			await fetchSpecificCourse();
		}
	} catch (error) {
		console.error('editing specific course failed', error);
	}
}

function handleFileChange(image: string) {
	uploadedImage.value = image;
}

function returnToCourses() {
	if (isAddCourseRoute.value) {
		router.push({
			name: 'courses',
		});
	} else {
		showSuccessModal.value = false;
	}
}

async function fetchSubjects() {
	// fetch subjects to populate subject dropdown
	try {
		const res = await subjectStore.fetchDropdownSubjects({ full: true });
		if (res) {
			fetchedSubjects.value = res.data;
		}
	} catch (error) {
		console.error('fetching subjects for dropdown failed.', error);
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

.course-details {
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

.course-top-container {
	min-height: 188px;
	background-color: $accent;
	padding-top: 40px;
	box-sizing: border-box;
}

h6 {
	color: $white;
}

.course-header {
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

.course {
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
