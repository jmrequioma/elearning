<template>
	<div class="homepage">
		<!-- Drawer -->
		<!-- <ui-drawer class="nav-drawer" type="dismissible" viewport-height nav-id="homepage-menu">
			<ui-drawer-header class="nav-drawer__header">
				<div class="nav-drawer__header__left">
					<img src="@/assets/media/arcanys-logo.png" alt="arcanys-logo" />
					<ui-drawer-title class="nav-drawer__title"
						>eLearning Portal</ui-drawer-title
					>
				</div>
				<ui-icon class="header-icon">menu</ui-icon>
			</ui-drawer-header>
			<ui-drawer-content class="nav-drawer__content">
				<ui-nav>
					<div class="nav-item-header">
						<p>MANAGEMENT</p>
					</div>
					<ui-nav-item :active="subjectRoute" class="nav-drawer__item">
						<img src="@/assets/media/bookshelf.png" alt="bookshelf-icon" />
						Subjects
					</ui-nav-item>
					<ui-nav-item :active="courseRoute" class="nav-drawer__item">
						<img src="@/assets/media/bookshelf.png" alt="bookshelf-icon" />
						Courses
					</ui-nav-item>
					<ui-nav-item :active="courseRoute" class="nav-drawer__item">
						<img src="@/assets/media/bookshelf.png" alt="bookshelf-icon" />
						Modules
					</ui-nav-item>
					<ui-nav-item :active="courseRoute" class="nav-drawer__item">
						<ui-icon>supervised_user_circle</ui-icon>
						Users
					</ui-nav-item>
				</ui-nav>
			</ui-drawer-content>
		</ui-drawer> -->
		<!-- Content -->
		<!-- <ui-drawer-app-content class="homepage-content"> -->
		<!-- App bar -->
		<!-- <ui-top-app-bar
				class="homepage-appbar"
				content-selector=".main"
				:nav-icon="false"
				nav-id="homepage-menu"
			>
				<template #toolbar="{}">
					<p>j.smith@arcanys.com</p>
				</template>
			</ui-top-app-bar> -->
		<!-- App content -->
		<!-- <div class="main">
				<router-view />
			</div>
		</ui-drawer-app-content> -->
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
							<div class="nav-drawer__item">
								<img src="@/assets/media/bookshelf.png" alt="bookshelf-icon" />
								Subjects
							</div>
							<div class="nav-drawer__item">
								<img src="@/assets/media/bookshelf.png" alt="bookshelf-icon" />
								Courses
							</div>
							<div class="nav-drawer__item">
								<img src="@/assets/media/bookshelf.png" alt="bookshelf-icon" />
								Modules
							</div>
							<div class="nav-drawer__item">
								<ui-icon>supervised_user_circle</ui-icon>
								Users
							</div>
						</div>
					</nav>
				</div>
			</div>
		</aside>
		<div class="main">
			<div class="homepage-appbar"></div>
			<router-view />
		</div>
	</div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const subjectRoute = computed(() => {
	return route.name === 'subjects';
});
const courseRoute = computed(() => {
	return route.name === 'courses';
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
	background-color: $gray-4;
	box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
	height: 64px;
	width: calc(100vw - 256px);
	margin-bottom: 4px;
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
}

.mdc-drawer {
	.mdc-deprecated-list-item {
		margin: 0;
		border-radius: 0;
		&--activated {
			background-color: $accent;
		}
	}
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
}

.mdc-top-app-bar__section--align-end {
	min-width: 400px;
	flex: 0 1 auto;
	padding-right: 40px;
	justify-content: flex-start;
	color: $gray-2;
}

.mdc-top-app-bar__section .mdc-top-app-bar__section--align-end {
	min-width: 400px;
	flex: 0 1 auto;
	padding-right: 40px;
	justify-content: flex-start;
	color: $gray-2;
}
</style>
