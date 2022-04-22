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
			<div v-if="search && !subjectsStore.fetchedSubjects.length" class="empty">
				No results found.
			</div>
			<div v-else class="table-container">
				<table class="course-table">
					<tr>
						<th>Title</th>
						<th>Courses</th>
						<th>Status</th>
					</tr>
					<tr
						v-for="subject in subjectsStore.fetchedSubjects"
						:key="subject.id"
						@click="selectSubject(subject)"
					>
						<td>{{ subject.title }}</td>
						<td>{{ getCoursesCount(subject) }} Courses</td>
						<td class="row-action">
							<template v-if="subject.isPublished"> Published </template>
							<template v-else> Draft </template>
							<div class="row-action__menu">
								<DropdownMenu
									:items="populateDropdownItems(subject)"
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
								<option v-for="option in options" :value="option" :key="option">
									{{ option }}
								</option>
							</select>
						</div>
					</div>
					<div class="table-control__pagination">
						{{ currStart }} - {{ currTotal }} of {{ subjectsStore.totalCount }}
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
				<p>
					Deleting this subject will also delete the courses and modules added
					to it.
				</p>
			</template>
			<template v-slot:actions>
				<ui-button @click="showDeleteModal = false">Cancel</ui-button>
				<ui-button @click="deleteSubject">Ok</ui-button>
			</template>
		</AlertModal>
	</div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { useSubjectsStore } from '@/stores/subject';
import { usePagination } from '@/composables/pagination';
import type { Subject } from '@/types';
import DropdownMenu from '@/components/DropdownMenu.vue';
import AlertModal from '@/components/AlertModal.vue';
import _ from 'lodash';
import { useRouter } from 'vue-router';

const search = ref('');
const totalCount = ref(0);
const subjectsStore = useSubjectsStore();
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

const selectedSubject: Subject = reactive({
	id: 0,
	title: '',
	isPublished: false,
	createdAt: '',
	updatedAt: '',
	ownerId: 0,
});
const openFilter = ref(false);
const checkedPublished = ref(false);
const checkedDraft = ref(false);
const showDeleteModal = ref(false);
const router = useRouter();

watch(
	currPage,
	_.debounce(() => {
		fetchSubjects();
	}, 500)
);

watch(
	[selectedLimit, checkedPublished, checkedDraft, search],
	_.debounce(() => {
		// reset the page to 1
		currPage.value = 1;
		fetchSubjects();
	}, 500)
);

onMounted(() => {
	fetchSubjects();
});

async function fetchSubjects() {
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
	await subjectsStore.fetchSubjects(data);
	totalCount.value = subjectsStore.fetchedTotalCount;
}

function populateDropdownItems(subject: Subject) {
	if (subject.isPublished) {
		return ['Unpublish', 'Edit', 'Delete'];
	}
	return ['Publish', 'Edit', 'Delete'];
}

function getCoursesCount(subject: Subject) {
	return subject.courses?.length;
}

async function handleSubjectStatus() {
	// publish/unpublish the subject
	let data = {
		id: selectedSubject.id,
		title: selectedSubject.title,
		isPublished: !selectedSubject.isPublished,
	};
	try {
		await subjectsStore.updateSubject(data);
		fetchSubjects();
	} catch (error) {
		console.error('updating subject failed', error);
	}
}

function handleAction(action: string) {
	if (action === 'Publish' || action === 'Unpublish') {
		handleSubjectStatus();
	} else if (action === 'Edit') {
		// handle Edit
		router.push({
			name: 'edit-subject',
			params: {
				id: selectedSubject.id,
			},
		});
	} else if (action == 'Delete') {
		// show double confirmation
		showDeleteModal.value = true;
	}
}

function selectSubject(subject: Subject) {
	selectedSubject.id = subject.id;
	selectedSubject.title = subject.title;
	selectedSubject.isPublished = subject.isPublished;
}

async function deleteSubject() {
	try {
		const res = await subjectsStore.deleteSubject({ id: selectedSubject.id });
		if (res) {
			fetchSubjects();
		}
	} catch (error) {
		console.error('Deleting subject failed.', error);
	} finally {
		showDeleteModal.value = false;
	}
}
</script>
<style scoped lang="scss">
@import '@/assets/scss/abstract/variables.scss';

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

.icon {
	color: $gray-1;
	cursor: pointer;

	&--disabled {
		color: $gray-2;
	}
}

.course-table {
	width: 100%;
	color: $gray-1;
	border-spacing: 0;

	th {
		padding: 12px 32px;
		text-align: left;
		border-bottom: 2px solid $gray-5;
		box-sizing: border-box;

		&:nth-child(2) {
			width: 240px;
		}

		&:nth-child(3) {
			width: 220px;
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
	position: absolute;
	font-size: 12px;
	border-top: 1px solid $gray-4;
	width: 100%;
	bottom: 0;
	height: 40px;

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

.empty {
	display: flex;
	justify-content: center;
}
</style>
