<template>
	<div class="homepage">
		<!-- Drawer -->
		<ui-drawer class="nav-drawer" viewport-height nav-id="homepage-menu">
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
					<ui-nav-item class="nav-drawer__item">Subjects</ui-nav-item>
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
			</ui-top-app-bar>
			<!-- App content -->
			<div class="main">
				<router-view />
			</div>
		</ui-drawer-app-content>
	</div>
</template>
<script setup lang="ts"></script>
<style scoped lang="scss">
@import '../assets/scss/abstract/variables.scss';

.homepage {
}

.homepage-appbar {
	background-color: $gray-4;
}

.nav-drawer {
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
	overflow: auto;
}
</style>
