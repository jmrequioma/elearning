<template>
	<div class="course-page">
		<div class="course-top-container">
			<div class="course-header">
				<div class="course-header__content">
					<img src="@/assets/media/bookshelf.png" alt="bookshelf-icon" />
					<h6>Courses</h6>
				</div>
				<div class="course-header__content">
					<ui-textfield v-model.trim="search" class="search" with-leading-icon>
						Search
						<template #before="{ iconClass }">
							<span :class="iconClass">
								<ui-icon>search</ui-icon>
							</span>
						</template>
					</ui-textfield>
					<div class="dropdown-container">
						<ui-icon-button
							class="filter-btn"
							icon="filter_list"
							@click="openFilter = true"
						></ui-icon-button>
						<ui-menu-anchor absolute>
							<ui-menu v-model="openFilter">
								<ui-menuitem>
									<ui-menuitem-text>Filter by Status</ui-menuitem-text>
								</ui-menuitem>
								<ui-menuitem-divider></ui-menuitem-divider>
								<ui-menuitem>
									<ui-checkbox
										v-model="checkedPublished"
										input-id="published"
									></ui-checkbox>
									<label for="published">Published</label>
								</ui-menuitem>
								<ui-menuitem>
									<ui-checkbox
										v-model="checkedDraft"
										input-id="draft"
									></ui-checkbox>
									<label for="draft">Draft</label>
								</ui-menuitem>
							</ui-menu>
						</ui-menu-anchor>
					</div>
				</div>
				<div class="course-header__content">
					<ui-button
						class="add-course-btn"
						unelevated
						@click="router.push({ name: 'add-course' })"
						>Add New Course</ui-button
					>
				</div>
			</div>
		</div>
		<div class="course-page__main">
			<div v-if="search && !courseStore.fetchedCourses?.length" class="empty">
				No results found.
			</div>
			<div v-else class="table-container">
				<table class="course-table">
					<tr>
						<th>Title</th>
						<th>Subject</th>
						<th>Author</th>
						<th>Modules</th>
						<th>Duration</th>
						<th>Status</th>
					</tr>
					<tr
						v-for="course in courseStore.fetchedCourses"
						:key="course.id"
						@click="selectCourse(course)"
					>
						<td>{{ course.title }}</td>
						<td>{{ course.subject?.title }}</td>
						<td>{{ course.author }}</td>
						<td>{{ getModulesCount(course) }}</td>
						<td>{{ course.duration }} min</td>
						<td class="row-action">
							<template v-if="course.isPublished"> Published </template>
							<template v-else> Draft </template>
							<div class="row-action__menu">
								<DropdownMenu
									v-if="isOwner(course)"
									:items="populateDropdownItems(course)"
									@handle-action="handleAction"
								/>
							</div>
						</td>
					</tr>
				</table>
			</div>
			<div class="table-control control-absolute">
				<div class="table-control__container">
					<div class="table-control__dropdown">
						<label for="items">Items per page:</label>
						<div class="select">
							<select name="items" v-model="selectedLimit">
								<option v-for="option in options" :value="option" :key="option">
									{{ option }}
								</option>
							</select>
						</div>
					</div>
					<div class="table-control__pagination">
						{{ currStart }} - {{ currTotal }} of {{ courseStore.totalCount }}
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
		<AlertModal v-if="showDeleteModal">
			<template v-slot:content>
				<p>Deleting this course will also delete the modules added to it.</p>
			</template>
			<template v-slot:actions>
				<ui-button @click="showDeleteModal = false">Cancel</ui-button>
				<ui-button @click="deleteCourse">Ok</ui-button>
			</template>
		</AlertModal>
	</div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { useCoursesStore } from '@/stores/course';
import { useAuthStore } from '@/stores/auth';
import { usePagination } from '@/composables/pagination';
import type { Course } from '@/types';
import DropdownMenu from '@/components/DropdownMenu.vue';
import AlertModal from '@/components/AlertModal.vue';
import _ from 'lodash';
import { useRouter } from 'vue-router';

const search = ref('');
const totalCount = ref(0);
const courseStore = useCoursesStore();
const authStore = useAuthStore();
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
} = usePagination(totalCount);

const selectedCourse: Course = reactive({
	id: 0,
	title: '',
	description: '',
	duration: 0,
	icon: '',
	isPublished: false,
	createdAt: '',
	updatedAt: '',
	subjectId: 0,
	authorId: 0,
});
const openFilter = ref(false);
const checkedPublished = ref(false);
const checkedDraft = ref(false);
const showDeleteModal = ref(false);
const router = useRouter();

watch(
	currPage,
	_.debounce(() => {
		fetchCourses();
	}, 500)
);

watch(
	[selectedLimit, checkedPublished, checkedDraft, search],
	_.debounce(() => {
		// reset the page to 1
		currPage.value = 1;
		fetchCourses();
	}, 500)
);

onMounted(() => {
	fetchCourses();
});

async function fetchCourses() {
	type filter = {
		limit: number;
		page: number;
		keyword: string;
		published?: boolean;
	};

	let data: filter = {
		limit: selectedLimit.value,
		page: currPage.value,
		keyword: search.value,
	};

	if (checkedPublished.value && !checkedDraft.value) {
		// fetch published only
		data['published'] = checkedPublished.value;
	}

	if (!checkedPublished.value && checkedDraft.value) {
		// fetch draft only
		data['published'] = checkedPublished.value;
	}
	await courseStore.fetchMainCourses(data);
	totalCount.value = courseStore.fetchedTotalCount;
}

function populateDropdownItems(course: Course) {
	if (course.isPublished) {
		return ['Unpublish', 'Edit', 'Delete'];
	}
	return ['Publish', 'Edit', 'Delete'];
}

function getModulesCount(course: Course) {
	const length = course.modules?.length;
	const unit = length === 1 ? 'Module' : 'Modules';
	return `${length} ${unit}`;
}

async function hanldeCourseStatus() {
	// publish/unpublish the course
	let data = {
		id: selectedCourse.id,
		title: selectedCourse.title,
		isPublished: !selectedCourse.isPublished,
	};
	try {
		await courseStore.updateCourse(data);
		fetchCourses();
	} catch (error) {
		console.error('updating course failed', error);
	}
}

function handleAction(action: string) {
	if (action === 'Publish' || action === 'Unpublish') {
		hanldeCourseStatus();
	} else if (action === 'Edit') {
		// handle Edit
		router.push({
			name: 'edit-course',
			params: {
				id: selectedCourse.id,
			},
		});
	} else if (action === 'Delete') {
		// show double confirmation
		showDeleteModal.value = true;
	}
}

function selectCourse(course: Course) {
	selectedCourse.id = course.id;
	selectedCourse.title = course.title;
	selectedCourse.isPublished = course.isPublished;
}

async function deleteCourse() {
	try {
		const res = await courseStore.deleteCourse({ id: selectedCourse.id });
		if (res) {
			fetchCourses();
		}
	} catch (error) {
		console.error('Deleting course failed.', error);
	} finally {
		showDeleteModal.value = false;
	}
}

function isOwner(course: Course) {
	return authStore.loggedInUser?.id === course.authorId;
}
</script>
<style scoped lang="scss">
@import '@/assets/scss/abstract/variables.scss';
@import '@/assets/scss/select.scss';
@import '@/assets/scss/table.scss';

.course-page {
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
	padding-top: 32px;
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

		.filter-btn {
			border-radius: 30px;
			background-color: $white;
			color: $gray-2;
			margin-left: 12px;
		}

		.add-course-btn {
			background-color: $white;
			color: $gray-1;
		}
	}
}

.search {
	border-radius: 25px;
	background-color: $white;
	width: 332px;
}

.table-container {
	overflow-y: auto;
	height: 85%;
}

.empty {
	display: flex;
	justify-content: center;
}
</style>
