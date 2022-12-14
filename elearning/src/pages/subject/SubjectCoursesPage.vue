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
				<div
					:class="[
						selectedTab === 'Courses' ? 'tab__item--active' : '',
						'tab__item',
					]"
					@click="selectedTab = 'Courses'"
				>
					Courses
				</div>
				<div
					:class="[
						selectedTab === 'Modules' ? 'tab__item--active' : '',
						'tab__item',
					]"
					@click="selectedTab = 'Modules'"
				>
					Modules
				</div>
			</div>
			<div class="content">
				<!-- courses tab -->
				<div v-if="selectedTab === 'Courses'" class="course">
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
							:disabled="isEditSubjectAddCourseRoute"
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
							Description
						</ui-textfield>
					</div>
					<ImageUploader
						:image="uploadedImage"
						@handle-file-change="(file) => (uploadedImage = file)"
					/>
				</div>
				<!-- modules tab -->
				<div v-else-if="selectedTab === 'Modules'" class="module">
					<div v-if="isEditSubjectEditCourseRoute" class="module-header">
						<ui-button class="alt-btn" unelevated @click="goToSubjectModules"
							><span class="capitalize">Add New Module</span></ui-button
						>
					</div>
					<div class="module-content">
						<div class="table-container">
							<table class="module-table">
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
									<td>{{ m.duration }}</td>
									<td class="row-action">
										<template v-if="m.isPublished"> Published </template>
										<template v-else> Draft </template>
										<div class="row-action__menu">
											<DropdownMenu
												v-if="isOwner(m)"
												:items="populateDropdownItems(m)"
												@handle-action="handleAction"
											/>
										</div>
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
									{{ fetchedSubject ? fetchedSubject.courses?.length : 0 }}
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
				<ui-button @click="returnToSubjects">Ok</ui-button>
			</template>
		</AlertModal>
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
import { useRoute } from 'vue-router';
import type { Course, Module, Subject } from '@/types';
import _ from 'lodash';
import { useRouter } from 'vue-router';

import ImageUploader from '@/components/ImageUploader.vue';
import DropdownMenu from '@/components/DropdownMenu.vue';
import AlertModal from '@/components/AlertModal.vue';

const statusOptions = [...STATUS_OPTIONS];
const title = ref('');
const desc = ref('');
const selectedStatus = ref('');
const titleErrorMsg = ref('');
const subjectsStore = useSubjectsStore();
const courseStore = useCoursesStore();
const moduleStore = useModulesStore();
const authStore = useAuthStore();
const fetchedSubject = ref<Subject>();
const fetchedCourse = ref<Course>();
const modules = ref<Module[]>([]);
const showSuccessModal = ref(false);
const route = useRoute();
const subjectId = ref(0);
const courseId = ref(0);
const selectedTab = ref('Courses');
const totalCourseCount = ref(0);
const selectedModule = ref<Module>();
const uploadedImage = ref('');
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
} = usePagination(totalCourseCount);

watch(
	currPage,
	_.debounce(() => {
		fetchModules();
	}, 500)
);

const headerTitle = computed(() => {
	const subjectText = fetchedSubject.value
		? `${fetchedSubject.value?.title}`
		: '';
	const courseText = fetchedCourse.value ? `${fetchedCourse.value?.title}` : '';

	return isEditSubjectAddCourseRoute.value
		? `${subjectText} > Add a course`
		: `${subjectText} > ${courseText}`;
});

const isEditSubjectAddCourseRoute = computed(() => {
	return route.name?.toString() === 'edit-subject-add-course';
});

const isEditSubjectEditCourseRoute = computed(() => {
	return route.name?.toString() === 'edit-subject-edit-course';
});

const successMessage = computed(() => {
	if (isEditSubjectAddCourseRoute.value) {
		return `Successfully created a course named ${title.value}.`;
	} else {
		return 'Course is successfully updated.';
	}
});

onMounted(async () => {
	const id = route.params.subjectId;
	subjectId.value = parseInt(id?.toString());
	// fetch specific subject
	isLoading.value = true;
	await fetchSpecificSubject();
	// if editing a course on edit subject, fetch the course
	if (isEditSubjectEditCourseRoute.value) {
		const courseParamId = route.params.courseId;
		courseId.value = parseInt(courseParamId?.toString());
		await fetchSpecificCourse();
		// fetch modules only if editing course
		fetchModules();
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

async function createCourse() {
	const data = {
		subjectId: fetchedSubject.value?.id,
		title: title.value,
		description: desc.value,
	};
	try {
		const res = await courseStore.createCourse(data);
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
		if (isEditSubjectAddCourseRoute.value) {
			createCourse();
		} else {
			editCourse();
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
		// set the appropriate models to display
		title.value = res.data.title;
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
		const data = {
			id: fetchedCourse.value?.id,
			title: title.value,
			isPublished: selectedStatus.value === 'Draft' ? false : true,
			description: desc.value,
		};
		const res = await courseStore.updateCourse(data);
		if (res) {
			showSuccessModal.value = true;
			fetchedCourse.value = res.data;
		}
	} catch (error) {
		console.error('editing specific course failed', error);
	}
}

function populateDropdownItems(module: Module) {
	if (module.isPublished) {
		return ['Unpublish', 'Edit', 'Delete'];
	}
	return ['Publish', 'Edit', 'Delete'];
}

async function handleModuleStatus() {
	// publish/unpublish the module
	const data = {
		id: selectedModule.value?.id,
		title: selectedModule.value?.title,
		isPublished: !selectedModule.value?.isPublished,
	};
	try {
		const res = await moduleStore.updateModule(data);
		if (res) {
			fetchModules();
		}
	} catch (error) {
		console.error('updating module failed', error);
	}
}

function handleAction(action: string) {
	if (action === 'Publish' || action === 'Unpublish') {
		handleModuleStatus();
	} else if (action === 'Edit') {
		// handle Edit
		router.push({
			name: 'edit-subject-edit-module',
			params: {
				subjectId: fetchedSubject.value?.id,
				courseId: fetchedCourse.value?.id,
				moduleId: selectedModule.value?.id,
			},
		});
	} else if (action === 'Delete') {
		// delete the module
		deleteModule();
	}
}

async function deleteModule() {
	try {
		const res = await moduleStore.deleteModule({
			id: selectedModule.value?.id,
		});
		if (res) {
			fetchModules();
		}
	} catch (error) {
		console.error('Deleting module failed.', error);
	}
}

function onFileChange(e: Event) {
	const input = e.target as HTMLInputElement;
	if (!input.files?.length) {
		return;
	}
	const file = input.files[0];
	uploadedImage.value = URL.createObjectURL(file);
}

// go to courses subject-modules page
function goToSubjectModules() {
	router.push({
		name: 'edit-subject-add-module',
		params: {
			subjectId: fetchedSubject.value?.id,
			courseId: fetchedCourse.value?.id,
		},
	});
}

function returnToSubjects() {
	if (isEditSubjectAddCourseRoute.value) {
		router.push({
			name: 'subjects',
		});
	} else {
		showSuccessModal.value = false;
	}
}

function isOwner(module: Module) {
	return authStore.loggedInUser?.id === module.authorId;
}
</script>
<style scoped lang="scss">
@import '@/assets/scss/abstract/variables.scss';
@import '@/assets/scss/select.scss';
@import '@/assets/scss/table.scss';

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

.full-field {
	width: 100%;
}

.image {
	display: flex;
	justify-content: center;
	padding-top: 44px;
	box-sizing: border-box;
	background-color: #c4c4c4;
	width: 165px;
	height: 165px;
	border-radius: 12px;
	align-items: center;
	border: 8px solid $gray-4;

	img {
		max-height: 144px;
		max-width: 128px;
	}

	&__content {
		cursor: pointer;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	&--display {
		padding-top: 0;
	}
}

.upload-text {
	font-size: 16px;
	color: $gray-1;
}

#file-input {
	display: none;
}
.module-header {
	display: flex;
	justify-content: flex-end;
}

.alt-btn {
	background-color: $accent;
	.capitalize {
		text-transform: capitalize;
	}
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

.alert {
	color: $error;
	font-size: 12px;
}
</style>
