<template>
	<div class="module-page">
		<div class="module-top-container">
			<div class="module-header">
				<div class="module-header__content">
					<img src="@/assets/media/bookshelf.png" alt="bookshelf-icon" />
					<h6>Modules</h6>
				</div>
				<div class="module-header__content">
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
				<div class="module-header__content">
					<ui-button
						class="add-module-btn"
						unelevated
						@click="router.push({ name: 'add-module' })"
						>Add New module</ui-button
					>
				</div>
			</div>
		</div>
		<div class="module-page__main">
			<div v-if="search && !moduleStore.fetchedModules?.length" class="empty">
				No results found.
			</div>
			<div v-else class="table-container">
				<table class="module-table">
					<tr>
						<th>Title</th>
						<th>Course</th>
						<th>Duration</th>
						<th>Status</th>
					</tr>
					<tr
						v-for="m in moduleStore.fetchedModules"
						:key="m.id"
						@click="selectModule(m)"
					>
						<td>{{ m.title }}</td>
						<td>{{ m.courseTitle }}</td>
						<td>{{ m.duration }} min</td>
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
						{{ currStart }} - {{ currTotal }} of {{ moduleStore.totalCount }}
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
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { useModulesStore } from '@/stores/module';
import { useAuthStore } from '@/stores/auth';
import { usePagination } from '@/composables/pagination';
import type { Module } from '@/types';
import DropdownMenu from '@/components/DropdownMenu.vue';
import _ from 'lodash';
import { useRouter } from 'vue-router';

const search = ref('');
const totalCount = ref(0);
const moduleStore = useModulesStore();
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

const selectedModule: Module = reactive({
	id: 0,
	title: '',
	duration: 0,
	description: '',
	isPublished: false,
	createdAt: '',
	updatedAt: '',
	courseId: 0,
	courseTitle: '',
	authorId: 0,
});
const openFilter = ref(false);
const checkedPublished = ref(false);
const checkedDraft = ref(false);
const router = useRouter();

watch(
	currPage,
	_.debounce(() => {
		fetchModules();
	}, 500)
);

watch(
	[selectedLimit, checkedPublished, checkedDraft, search],
	_.debounce(() => {
		// reset the page to 1
		currPage.value = 1;
		fetchModules();
	}, 500)
);

onMounted(() => {
	fetchModules();
});

async function fetchModules() {
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
	await moduleStore.fetchMainModules(data);
	totalCount.value = moduleStore.fetchedTotalCount;
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
		id: selectedModule.id,
		isPublished: !selectedModule.isPublished,
	};
	try {
		await moduleStore.updateModule(data);
		fetchModules();
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
			name: 'edit-module',
			params: {
				id: selectedModule.id,
			},
		});
	} else if (action === 'Delete') {
		// show double confirmation
		deleteModule();
	}
}

function selectModule(module: Module) {
	selectedModule.id = module.id;
	selectedModule.title = module.title;
	selectedModule.isPublished = module.isPublished;
}

async function deleteModule() {
	try {
		const res = await moduleStore.deleteModule({ id: selectedModule.id });
		if (res) {
			fetchModules();
		}
	} catch (error) {
		console.error('Deleting module failed.', error);
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

.module-page {
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
	padding-top: 32px;
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

		.filter-btn {
			border-radius: 30px;
			background-color: $white;
			color: $gray-2;
			margin-left: 12px;
		}

		.add-module-btn {
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
