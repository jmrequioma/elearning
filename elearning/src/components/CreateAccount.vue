<template>
	<ui-card class="account-card">
		<h4>eLearning Portal</h4>
		<h6>CREATE AN ACCOUNT</h6>
		<ui-select v-model="selectedRole" :options="options" outlined>
			Role
		</ui-select>
	</ui-card>
</template>
<script setup lang="ts">
import { ROLES } from '@/constants';
import { ref } from 'vue';

const selectedRole = ref('');
const options = [...ROLES];
</script>
<style scoped lang="scss">
.account-card {
	margin: auto;
	padding: 64px 32px;
}

h6 {
	margin-top: 24px;
	margin-bottom: 24px;
	text-align: center;
}
</style>
