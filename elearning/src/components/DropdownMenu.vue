<template>
	<ui-icon class="icon" @click="isOpen = true">more_vert</ui-icon>
	<ui-menu-anchor absolute>
		<ui-menu v-model="isOpen">
			<template v-for="item in items" :key="item">
				<ui-menuitem @click="handleAction(item as string)">
					<ui-menuitem-text id="menu-item-text">{{ item }}</ui-menuitem-text>
				</ui-menuitem>
			</template>
		</ui-menu>
	</ui-menu-anchor>
</template>
<script setup lang="ts">
import { ref } from 'vue';

defineProps({
	items: Array,
});

const emit = defineEmits(['handleAction']);
const isOpen = ref(false);

function handleAction(action: string) {
	emit('handleAction', action);
}
</script>
<style scoped lang="scss">
@import '../assets/scss/abstract/variables.scss';

.icon {
	color: $gray-1;
	cursor: pointer;
}
</style>
