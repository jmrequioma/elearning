<template>
	<div class="subject-page">
		<div class="subject-top-container">
			<div class="subject-header">
				<div class="subject-header__content">
					<img src="@/assets/media/bookshelf.png" alt="bookshelf-icon" />
					<h6>Subjects</h6>
				</div>
				<div class="subject-header__content">
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
				<div class="subject-header__content">
					<ui-button
						class="add-subject-btn"
						unelevated
						@click="router.push({ name: 'add-subject' })"
						>Add New Subject</ui-button
					>
				</div>
			</div>
		</div>
		<div class="subject-page__main">
			<div
				v-if="search && !subjectsStore.fetchedSubjects?.length"
				class="empty"
			>
				No results found.
			</div>
			<div v-else class="table-container">
				<table class="subject-table">
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
						<td>{{ getCoursesCount(subject) }}</td>
						<td class="row-action">
							<template v-if="subject.isPublished"> Published </template>
							<template v-else> Draft </template>
							<div class="row-action__menu">
								<DropdownMenu
									v-if="isOwner(subject)"
									:items="populateDropdownItems(subject)"
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
import { useAuthStore } from '@/stores/auth';
import { usePagination } from '@/composables/pagination';
import type { Subject } from '@/types';
import DropdownMenu from '@/components/DropdownMenu.vue';
import AlertModal from '@/components/AlertModal.vue';
import _ from 'lodash';
import { useRouter } from 'vue-router';

const search = ref('');
const totalCount = ref(0);
const subjectsStore = useSubjectsStore();
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

	const data: filter = {
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
	const length = subject.courses?.length;
	const unit = length === 1 ? 'Course' : 'Courses';
	return `${length} ${unit}`;
}

async function handleSubjectStatus() {
	// publish/unpublish the subject
	const data = {
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
	} else if (action === 'Delete') {
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

function isOwner(subject: Subject) {
	return authStore.loggedInUser?.id === subject.ownerId;
}
</script>
<style scoped lang="scss">
@import '@/assets/scss/abstract/variables.scss';
@import '@/assets/scss/select.scss';
@import '@/assets/scss/table.scss';

.subject-page {
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
	padding-top: 32px;
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

		.filter-btn {
			border-radius: 30px;
			background-color: $white;
			color: $gray-2;
			margin-left: 12px;
		}

		.add-subject-btn {
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
