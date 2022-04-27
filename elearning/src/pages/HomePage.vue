<template>
	<div class="homepage">
		<aside>
			<div class="nav-drawer">
				<div class="nav-drawer__header">
					<div class="nav-drawer__header__left">
						<img src="@/assets/media/arcanys-logo.png" alt="arcanys-logo" />
						<p class="nav-drawer__title">eLearning Portal</p>
					</div>
					<ui-icon class="header-icon">menu</ui-icon>
				</div>
				<div class="nav-drawer__content">
					<nav>
						<div class="nav-item-header">
							<p>MANAGEMENT</p>
						</div>
						<div class="drawer-items">
							<div
								v-if="userRole === 'instructor'"
								:class="[subjectRoute ? 'active' : '', 'nav-drawer__item']"
							>
								<router-link
									class="nav-drawer__link"
									:to="{ name: 'subjects' }"
								>
									<img
										src="@/assets/media/bookshelf.png"
										alt="bookshelf-icon"
									/>
									Subjects
								</router-link>
							</div>
							<div
								v-if="userRole === 'instructor' || userRole === 'student'"
								:class="[courseRoute ? 'active' : '', 'nav-drawer__item']"
							>
								<router-link
									class="nav-drawer__link"
									:to="{ name: coursesLink }"
								>
									<img
										src="@/assets/media/bookshelf.png"
										alt="bookshelf-icon"
									/>
									Courses
								</router-link>
							</div>
							<div
								v-if="userRole === 'student'"
								:class="[myCourseRoute ? 'active' : '', 'nav-drawer__item']"
							>
								<router-link
									class="nav-drawer__link"
									:to="{ name: 'my-courses' }"
								>
									<img
										src="@/assets/media/bookshelf.png"
										alt="bookshelf-icon"
									/>
									My Courses
								</router-link>
							</div>
							<div
								v-if="userRole === 'instructor'"
								:class="[moduleRoute ? 'active' : '', 'nav-drawer__item']"
							>
								<router-link class="nav-drawer__link" :to="{ name: 'modules' }">
									<img
										src="@/assets/media/bookshelf.png"
										alt="bookshelf-icon"
									/>
									Modules
								</router-link>
							</div>
							<div
								v-if="userRole === 'admin'"
								:class="[userRoute ? 'active' : '', 'nav-drawer__item']"
							>
								<router-link class="nav-drawer__link" :to="{ name: 'users' }">
									<ui-icon>supervised_user_circle</ui-icon>
									Users
								</router-link>
							</div>
						</div>
					</nav>
				</div>
			</div>
		</aside>
		<div class="main">
			<div class="homepage-appbar">
				<div class="user">
					<div class="user__details">
						<img src="@/assets/media/avatar.png" class="user__avatar" />
						{{ authStore.loggedInUser?.email }}
					</div>
					<div class="user__menu">
						<ui-icon class="icon" @click="openUserDropdown = true"
							>keyboard_arrow_down</ui-icon
						>
						<ui-menu-anchor absolute>
							<ui-menu v-model="openUserDropdown">
								<ui-menuitem>
									<ui-menuitem-icon
										><ui-icon outlined
											>account_circle</ui-icon
										></ui-menuitem-icon
									>
									<ui-menuitem-text>My Profile</ui-menuitem-text>
								</ui-menuitem>
								<ui-menuitem>
									<ui-menuitem-icon><ui-icon>lock</ui-icon></ui-menuitem-icon>
									<ui-menuitem-text>Change Password</ui-menuitem-text>
								</ui-menuitem>
								<ui-menuitem @click="logout">
									<ui-menuitem-icon
										><ui-icon outlined>logout</ui-icon></ui-menuitem-icon
									>
									<ui-menuitem-text>Logout</ui-menuitem-text>
								</ui-menuitem>
							</ui-menu>
						</ui-menu-anchor>
					</div>
				</div>
			</div>
			<router-view />
		</div>
	</div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const openUserDropdown = ref(false);
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const subjectRoute = computed(() => {
	return route.name?.toString().includes('subject');
});
const courseRoute = computed(() => {
	return (
		route.name === 'courses' ||
		route.name === 'add-course' ||
		route.name === 'edit-course' ||
		route.name === 'student-courses'
	);
});
const myCourseRoute = computed(() => {
	return route.name === 'my-courses' || route.name === 'view-course';
});
const moduleRoute = computed(() => {
	return (
		route.name === 'modules' ||
		route.name === 'add-module' ||
		route.name === 'edit-module'
	);
});

const userRoute = computed(() => {
	return route.name === 'users' || route.name === 'view-user';
});

const userRole = computed(() => {
	return authStore.loggedInUser?.role;
});

const coursesLink = computed(() => {
	return userRole.value === 'instructor' ? 'courses' : 'student-courses';
});

function getUserDetails() {
	authStore.getLoggedInUserInfo();
}

function logout() {
	authStore.logout();
	router.push({ name: 'login' });
}

onMounted(() => {
	getUserDetails();
});
</script>
<style scoped lang="scss">
@import '../assets/scss/abstract/variables.scss';

.homepage {
	width: 100%;
	display: flex;
	height: 100%;
}

.homepage-appbar {
	display: flex;
	box-sizing: border-box;
	padding-right: 12px;
	font-size: 14px;
	font-weight: 500;
	color: $gray-2;
	align-items: center;
	justify-content: flex-end;
	background-color: $gray-4;
	box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
	height: 64px;
	margin-bottom: 4px;
}

.icon {
	cursor: pointer;
}

.user {
	display: flex;
	align-items: center;
	width: 244px;
	justify-content: space-between;

	&__details {
		display: flex;
		align-items: center;
	}

	&__avatar {
		border-radius: 50%;
		height: 40px;
		width: 40px;
		border: 1px solid $gray-1;
		margin-right: 12px;
	}

	&__menu {
		position: relative;
	}
}

.nav-drawer {
	border-right: 0;
	height: 100vh;
	width: 256px;

	&__header {
		background-color: $black;
		display: flex;
		height: 64px;
		align-items: center;
		align-content: center;
		justify-content: space-between;
		padding-left: 16px;
		padding-right: 16px;

		&__left {
			display: flex;
			align-items: center;
			align-content: left;
		}

		img {
			height: 20px;
		}
	}

	&__title {
		color: $white;
		font-weight: 400;
		font-size: 16px;
		display: flex;
		margin-left: 12px;
	}

	&__content {
		background-color: $dark-gray;
		height: calc(100vh - 64px);
		box-sizing: border-box;
		overflow-y: auto;

		p {
			margin-block-start: 0;
			margin-block-end: 0;
		}

		.nav-item-header {
			color: $white-3;
			padding: 16px 16px 8px;
		}
	}

	&__item {
		color: $white;
		font-weight: 400;
		display: flex;
		padding: 12px 16px;

		img {
			margin-right: 12px;
		}

		i {
			margin-right: 8px;
		}
	}

	&__link {
		text-decoration: none;
		color: $white;
		display: flex;
		width: 100%;
	}
}

.active {
	background-color: $accent;
}

.header-icon {
	color: $white-2;
}

.demo-content {
	width: 100%;
}

.homepage-content {
	height: 100%;
	width: 100%;
	overflow: auto;
}

.main {
	height: 100%;
	width: 100%;
}
</style>
