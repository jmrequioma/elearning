<template>
	<div class="homepage">
		<!-- Drawer -->
		<ui-drawer
			class="nav-drawer"
			type="dismissible"
			viewport-height
			nav-id="homepage-menu"
		>
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
		</ui-drawer>
		<!-- Content -->
		<ui-drawer-app-content class="homepage-content">
			<!-- App bar -->
			<ui-top-app-bar
				class="homepage-appbar"
				content-selector=".main"
				:nav-icon="false"
				nav-id="homepage-menu"
			>
				<template #toolbar="{}">
					<p>j.smith@arcanys.com</p>
				</template>
			</ui-top-app-bar>
			<!-- App content -->
			<div class="main">
				<router-view />
			</div>
		</ui-drawer-app-content>
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
}

.homepage-appbar {
	background-color: $gray-4;
	box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
}

.nav-drawer {
	border-right: 0;
	&__header {
		background-color: $black;
		display: flex;
		align-items: center;
		align-content: center;
		justify-content: space-between;

		&__left {
			display: flex;
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
	}

	&__item {
		color: $white;
		font-weight: 400;
		display: flex;

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

.nav-item-header {
	margin-left: 12px;
	color: $white-3;
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
