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
							<div :class="[subjectRoute ? 'active' : '', 'nav-drawer__item']">
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
							<div class="nav-drawer__item">
								<router-link
									class="nav-drawer__link"
									:to="{ name: 'subjects' }"
								>
									<img
										src="@/assets/media/bookshelf.png"
										alt="bookshelf-icon"
									/>
									Courses
								</router-link>
							</div>
							<div class="nav-drawer__item">
								<router-link
									class="nav-drawer__link"
									:to="{ name: 'subjects' }"
								>
									<img
										src="@/assets/media/bookshelf.png"
										alt="bookshelf-icon"
									/>
									Modules
								</router-link>
							</div>
							<div class="nav-drawer__item">
								<router-link
									class="nav-drawer__link"
									:to="{ name: 'subjects' }"
								>
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
}
</style>
