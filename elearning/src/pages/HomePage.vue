<template>
	<div class="home-page">
		<Login />
	</div>
</template>
<script setup lang="ts">
import Login from '@/components/Login.vue';
</script>
<style>
.home-page {
	display: flex;
	margin: auto;
	background-image: url('@/assets/media/Fuse\ Background.png');
	background-repeat: no-repeat;
	background-attachment: fixed;
	background-position: center;
	background-size: cover;
	min-height: 100vh;
	width: 100%;
	overflow: hidden;
}
</style>
