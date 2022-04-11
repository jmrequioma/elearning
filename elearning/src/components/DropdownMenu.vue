<template>
	<ui-icon class="icon" @click="isOpen = true">more_vert</ui-icon>
	<ui-menu-anchor absolute>
		<ui-menu v-model="isOpen">
			<ui-menuitem v-for="item in items" :key="item">
				<ui-menuitem-text>{{ item }}</ui-menuitem-text>
			</ui-menuitem>
		</ui-menu>
	</ui-menu-anchor>
</template>
<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
	items: Array,
});
const isOpen = ref(false);
</script>
<style scoped lang="scss">
@import '../assets/scss/abstract/variables.scss';

.icon {
	color: $gray-1;
	cursor: pointer;
}
</style>
