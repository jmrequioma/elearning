<template>
	<div class="app">
		<router-view />
	</div>
</template>
<script setup lang="ts"></script>
<style lang="scss">
@import '@/assets/scss/abstract/variables.scss';
@import '@/assets/scss/base.scss';

.app {
	display: flex;
}
</style>
