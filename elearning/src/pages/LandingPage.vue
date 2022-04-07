<template>
	<div class="landing-page">
		<router-view />
	</div>
</template>
<script setup lang="ts"></script>
<style>
.landing-page {
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
