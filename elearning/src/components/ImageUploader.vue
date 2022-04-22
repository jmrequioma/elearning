<template>
	<div v-if="!uploadedImage" class="image">
		<label for="file-input">
			<div class="image__content">
				<img src="@/assets/media/add-img-icon.png" />
				<p class="upload-text">Upload course icon</p>
			</div>
		</label>
		<input
			type="file"
			accept="image/*"
			id="file-input"
			@change="onFileChange"
		/>
	</div>
	<div v-else class="image image--display">
		<label for="file-input">
			<img :src="uploadedImage" />
		</label>
		<input
			type="file"
			accept="image/*"
			id="file-input"
			@change="onFileChange"
		/>
	</div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
	image: String,
});
const uploadedImage = ref(props.image);

const emit = defineEmits(['handleFileChange']);

watch(
	() => props.image,
	() => {
		uploadedImage.value = props.image;
	}
);

function onFileChange(e: Event) {
	const input = e.target as HTMLInputElement;
	if (!input.files?.length) {
		return;
	}
	const file = input.files[0];
	uploadedImage.value = URL.createObjectURL(file);
	// emit to parent
	emit('handleFileChange', uploadedImage.value);
}
</script>
<style scoped lang="scss">
@import '@/assets/scss/abstract/variables.scss';

.image {
	display: flex;
	justify-content: center;
	padding-top: 44px;
	box-sizing: border-box;
	background-color: #c4c4c4;
	width: 165px;
	height: 165px;
	border-radius: 12px;
	align-items: center;
	border: 8px solid $gray-4;

	img {
		max-height: 144px;
		max-width: 128px;
		cursor: pointer;
	}

	&__content {
		cursor: pointer;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	&--display {
		cursor: pointer;
		padding-top: 0;
	}
}

.upload-text {
	font-size: 16px;
	color: $gray-1;
}

#file-input {
	display: none;
}
</style>
