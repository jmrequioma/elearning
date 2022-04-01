<template>
	<div class="app">
		<RouterView />
	</div>
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>
<style lang="scss">
@import '@/assets/scss/abstract/variables.scss';
@import '@/assets/scss/base.scss';

.app {
	display: flex;
}
</style>
