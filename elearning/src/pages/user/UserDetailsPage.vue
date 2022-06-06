<template>
	<div class="user-details">
		<div class="user-top-container">
			<div class="user-header">
				<div class="user-header__content">
					<img src="@/assets/media/bookshelf.png" alt="bookshelf-icon" />
					<h6 v-if="!isLoading">{{ userFullName }}</h6>
				</div>
				<div class="user-header__content"></div>
			</div>
		</div>
		<div class="user-details__main">
			<div class="tab">
				<div
					:class="[
						selectedTab === 'User' ? 'tab__item--active' : '',
						'tab__item',
					]"
					@click="selectedTab = 'User'"
				>
					User
				</div>
			</div>
			<div class="content">
				<!-- user tab -->
				<div v-if="selectedTab === 'User'" class="user">
					<div class="col-2">
						<div class="field">
							<ui-textfield
								id="name"
								v-model="name"
								class="full-field"
								input-type="text"
								outlined
								required
								disabled
							>
								Name
							</ui-textfield>
						</div>
						<ui-textfield
							class="field"
							v-model="email"
							outlined
							required
							disabled
						>
							Email
						</ui-textfield>
					</div>
					<div class="col-2">
						<ui-textfield
							id="role"
							v-model="userRole"
							class="field"
							input-type="text"
							outlined
							required
							disabled
						>
							Role
						</ui-textfield>
						<ui-select
							class="field"
							v-model="selectedStatus"
							outlined
							required
							disabled
							fullwidth
							:options="statusOptions"
						>
							Status
						</ui-select>
					</div>
				</div>
			</div>
		</div>
		<router-view />
	</div>
</template>
<script setup lang="ts">
import { USER_STATUS_OPTIONS } from '@/constants';
import { computed, onMounted, ref } from 'vue';
import { useUsersStore } from '@/stores/user';

import { useRoute } from 'vue-router';
import type { User } from '@/types';

const statusOptions = [...USER_STATUS_OPTIONS];
const name = ref('');
const email = ref('');
const selectedStatus = ref('');
const userStore = useUsersStore();
const fetchedUser = ref<User>();
const route = useRoute();
const userId = ref(0);
const selectedTab = ref('User');
const isLoading = ref(false);

const userFullName = computed(() => {
	return `${fetchedUser.value?.firstName} ${fetchedUser.value?.lastName}`;
});

const userRole = computed(() => {
	const role = fetchedUser.value?.role;
	return role ? role?.charAt(0).toUpperCase() + role?.slice(1) : '';
});

onMounted(async () => {
	// check if page is for adding or editing
	isLoading.value = true;
	const id = route.params.id;
	userId.value = parseInt(id?.toString());
	// fetch user
	await fetchSpecificUser();
	isLoading.value = false;
});

async function fetchSpecificUser() {
	const data = { id: userId.value };
	// fetch specific user
	try {
		const res = await userStore.fetchUserDetails(data);
		fetchedUser.value = res.data;
		// set the text field models
		name.value = userFullName.value;
		email.value = res.data.email;
		selectedStatus.value = res.data.isActive ? 'Active' : 'Inactive';
	} catch (error) {
		console.error('fetching specific user failed', error);
	}
}
</script>
<style scoped lang="scss">
@import '@/assets/scss/abstract/variables.scss';

.user-details {
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
	padding-top: 40px;
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

.user {
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
