<template>
	<div class="user-page">
		<div class="user-top-container">
			<div class="user-header">
				<div class="user-header__content">
					<img src="@/assets/media/bookshelf.png" alt="bookshelf-icon" />
					<h6>Users</h6>
				</div>
				<div class="user-header__content">
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
									<ui-menuitem-text>Filter by Role</ui-menuitem-text>
								</ui-menuitem>
								<ui-menuitem-divider></ui-menuitem-divider>
								<ui-menuitem>
									<ui-radio
										v-model="roleFilter"
										input-id="all"
										value="all"
									></ui-radio>
									<label for="all">All</label>
								</ui-menuitem>
								<ui-menuitem>
									<ui-radio
										v-model="roleFilter"
										input-id="admin"
										value="admin"
									></ui-radio>
									<label for="admin">Admin</label>
								</ui-menuitem>
								<ui-menuitem>
									<ui-radio
										v-model="roleFilter"
										input-id="instructor"
										value="instructor"
									></ui-radio>
									<label for="instructor">Instructor</label>
								</ui-menuitem>
								<ui-menuitem>
									<ui-radio
										v-model="roleFilter"
										input-id="student"
										value="student"
									></ui-radio>
									<label for="student">Student</label>
								</ui-menuitem>
							</ui-menu>
						</ui-menu-anchor>
					</div>
				</div>
				<div class="user-header__content"></div>
			</div>
		</div>
		<div class="user-page__main">
			<div v-if="search && !userStore.fetchedUsers?.length" class="empty">
				No results found.
			</div>
			<div v-else class="table-container">
				<table class="user-table">
					<tr>
						<th>Name</th>
						<th>Email</th>
						<th>Role</th>
						<th>Status</th>
					</tr>
					<tr
						v-for="user in userStore.fetchedUsers"
						:key="user.id"
						@click="selectUser(user)"
					>
						<td>{{ user.firstName }} {{ user.lastName }}</td>
						<td>{{ user.email }}</td>
						<td class="capitalize">{{ user.role }}</td>
						<td class="row-action">
							<template v-if="user.isActive"> Active </template>
							<template v-else> Inactive </template>
							<div class="row-action__menu">
								<DropdownMenu
									:items="populateDropdownItems()"
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
						{{ currStart }} - {{ currTotal }} of {{ userStore.totalCount }}
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
import { useUsersStore } from '@/stores/user';
import { usePagination } from '@/composables/pagination';
import type { User } from '@/types';
import DropdownMenu from '@/components/DropdownMenu.vue';
import _ from 'lodash';
import { useRouter } from 'vue-router';

const search = ref('');
const totalCount = ref(0);
const userStore = useUsersStore();
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

const selectedUser: User = reactive({
	accessToken: '',
	id: 0,
	email: '',
	firstName: '',
	lastName: '',
	role: '',
	isActive: false,
});
const openFilter = ref(false);
const roleFilter = ref('');
const router = useRouter();

watch(
	currPage,
	_.debounce(() => {
		fetchUsers();
	}, 500)
);

watch(
	[selectedLimit, roleFilter, search],
	_.debounce(() => {
		// reset the page to 1
		currPage.value = 1;
		fetchUsers();
	}, 500)
);

onMounted(() => {
	fetchUsers();
});

async function fetchUsers() {
	type filter = {
		limit: number;
		page: number;
		keyword: string;
		role?: string;
	};

	let data: filter = {
		limit: selectedLimit.value,
		page: currPage.value,
		keyword: search.value,
	};

	if (roleFilter.value != 'all') {
		data['role'] = roleFilter.value;
	}
	await userStore.fetchUsers(data);
	totalCount.value = userStore.fetchedTotalCount;
}

function populateDropdownItems() {
	return ['View'];
}

function handleAction(action: string) {
	if (action === 'View') {
		// handle View
		router.push({
			name: 'view-user',
			params: {
				id: selectedUser.id,
			},
		});
	}
}

function selectUser(user: User) {
	selectedUser.id = user.id;
	selectedUser.email = user.email;
}
</script>
<style scoped lang="scss">
@import '@/assets/scss/abstract/variables.scss';
@import '@/assets/scss/select.scss';
@import '@/assets/scss/table.scss';

.user-page {
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

.user-top-container {
	min-height: 188px;
	background-color: $accent;
	padding-top: 32px;
	box-sizing: border-box;
}

h6 {
	color: $white;
}

.user-header {
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

		.add-user-btn {
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

.capitalize {
	text-transform: capitalize;
}

.empty {
	display: flex;
	justify-content: center;
}
</style>
