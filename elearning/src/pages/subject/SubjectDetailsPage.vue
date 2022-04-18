<template>
	<div class="subject-details">
		<div class="subject-top-container">
			<div class="subject-header">
				<div class="subject-header__content">
					<img src="@/assets/media/bookshelf.png" alt="bookshelf-icon" />
					<h6>{{ headerTitle }}</h6>
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
						selectedTab == 'Subjects' ? 'tab__item--active' : '',
						'tab__item',
					]"
					@click="selectedTab = 'Subjects'"
				>
					Subject
				</div>
				<div
					:class="[
						selectedTab == 'Courses' ? 'tab__item--active' : '',
						'tab__item',
					]"
					@click="selectedTab = 'Courses'"
				>
					Courses
				</div>
			</div>
			<div class="content">
				<!-- subjects tab -->
				<div v-if="selectedTab == 'Subjects'" class="subject">
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
						v-model="selectedStatus"
						outlined
						required
						:disabled="isAddSubjectRoute"
						fullwidth
						:options="statusOptions"
					>
						Status
					</ui-select>
				</div>
				<!-- courses tab -->
				<div v-else-if="selectedTab == 'Courses'" class="course">
					<div class="course-header">
						<ui-button class="alt-btn" unelevated
							><span class="capitalize">Add New Course</span></ui-button
						>
					</div>
					<div class="course-content">
						<div class="table-container">
							<table class="courses-table">
								<tr>
									<th>Title</th>
									<th>Author</th>
									<th>Modules</th>
									<th>Duration</th>
									<th>Status</th>
								</tr>
								<tr v-for="course in fetchedSubject.courses" :key="course.id">
									<td>{{ course.title }}</td>
									<td>{{ course.authorId }}</td>
									<td>{{ course.title }}</td>
									<td>{{ course.duration }} min</td>
									<!-- <td>{{ getCoursesCount(subject) }} Courses</td> -->
									<td class="row-action">
										<template v-if="course.isPublished"> Published </template>
										<template v-else> Draft </template>
										<div class="row-action__menu">
											<!-- <DropdownMenu
											:items="populateDropdownItems(subject)"
											@handle-action="handleAction"
										/> -->
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
									{{ fetchedSubject.courses.length }}
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
				<ui-button @click="$router.push({ name: 'subjects' })">Ok</ui-button>
			</template>
		</AlertModal>
	</div>
</template>
<script setup lang="ts">
import { STATUS_OPTIONS } from '@/constants';
import { computed, onMounted, ref, reactive } from 'vue';
import { useSubjectsStore } from '@/stores/subject';
import { usePagination } from '@/composables/pagination';
import AlertModal from '@/components/AlertModal.vue';
import { useRoute, onBeforeRouteLeave } from 'vue-router';
import type { Subject } from '@/types';

const statusOptions = [...STATUS_OPTIONS];
const title = ref('');
const selectedStatus = ref('');
const titleErrorMsg = ref('');
const subjectsStore = useSubjectsStore();
const showSuccessModal = ref(false);
const route = useRoute();
const subjectId = ref(0);
const selectedTab = ref('Subjects');
const totalCourseCount = ref(0);
let fetchedSubject: Subject = reactive({
	id: subjectId,
	title: '',
	isPublished: false,
	createdAt: '',
	updatedAt: '',
	ownerId: 0,
});

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

const headerTitle = computed(() => {
	if (isAddSubjectRoute.value) {
		return 'Add a subject';
	} else {
		return fetchedSubject.title;
	}
});

const isAddSubjectRoute = computed(() => {
	return route.name?.toString() === 'add-subject';
});

const successMessage = computed(() => {
	if (isAddSubjectRoute.value) {
		return `Successfully created a subject named ${title.value}.`;
	} else {
		return 'Subject is successfully updated.';
	}
});

const unsavedChanges = computed(() => {
	const status = selectedStatus.value === 'Draft' ? false : true;
	if (!isAddSubjectRoute.value) {
		return (
			title.value != fetchedSubject.title ||
			status != fetchedSubject.isPublished
		);
	}
	return false;
});

onMounted(() => {
	// check if page is for adding or editing
	if (!isAddSubjectRoute.value) {
		const id = route.params.id;
		subjectId.value = parseInt(id.toString());
		// fetch specific subject
		fetchSpecificSubject();
	}
});

function validateTitle() {
	if (title.value) {
		titleErrorMsg.value = '';
	} else {
		titleErrorMsg.value = 'Title is required.';
	}
}

async function createSubject() {
	try {
		const res = await subjectsStore.createSubject({ title: title.value });
		if (res) {
			showSuccessModal.value = true;
		}
	} catch (error) {
		console.error('creating subject failed', error);
		if ((error as Error).message.includes('409')) {
			titleErrorMsg.value = 'Subject already exists.';
		}
	}
}

function save() {
	validateTitle();
	if (!titleErrorMsg.value) {
		if (isAddSubjectRoute.value) {
			createSubject();
		} else {
			editSubject();
		}
	}
}

async function fetchSpecificSubject() {
	const data = { id: subjectId.value };
	// fetch specific subject
	try {
		const res = await subjectsStore.fetchSubjectDetails(data);
		fetchedSubject.title = res.data.title;
		fetchedSubject.isPublished = res.data.isPublished;
		fetchedSubject.courses = res.data.courses;
		totalCourseCount.value = fetchedSubject.courses?.length || 0;
		// set the text field models
		title.value = res.data.title;
		selectedStatus.value = res.data.isPublished ? 'Published' : 'Draft';
	} catch (error) {
		console.error('fetching specific subject failed', error);
	}
}

async function editSubject() {
	try {
		let data = {
			id: fetchedSubject.id,
			title: title.value,
			isPublished: selectedStatus.value === 'Draft' ? false : true,
		};
		const res = await subjectsStore.updateSubject(data);
		if (res) {
			showSuccessModal.value = true;
		}
	} catch (error) {
		console.error('editing specific subject failed', error);
	}
}

onBeforeRouteLeave((to, from) => {
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

.subject {
	margin-top: 14px;
	display: flex;
	justify-content: space-between;
	width: 100%;
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

.table-container {
	overflow-y: auto;
	height: 344px;
}

.courses-table {
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
			width: 436px;
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
</style>
