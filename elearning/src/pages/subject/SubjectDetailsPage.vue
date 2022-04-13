<template>
	<div class="subject-details">
		<div class="subject-top-container">
			<div class="subject-header">
				<div class="subject-header__content">
					<img src="@/assets/media/bookshelf.png" alt="bookshelf-icon" />
					<h6>Add a subject</h6>
				</div>
				<div class="subject-header__content">
					<ui-button class="save-btn" unelevated @click="save">Save</ui-button>
				</div>
			</div>
		</div>
		<div class="subject-details__main">
			<div class="tab">
				<div class="tab__item tab__item--active">Subject</div>
				<div class="tab__item">Courses</div>
			</div>
			<div class="content">
				<div class="field">
					<ui-textfield
						id="title"
						v-model="title"
						class="title-field"
						input-type="text"
						outlined
						required
						pattern=".{1,}"
						helper-text-id="title-helper-text"
					>
						Title
					</ui-textfield>
					<ui-textfield-helper
						v-if="titleErrorMsg"
						id="title-helper-text"
						visible
						validMsg
					>
						<small class="alert">{{ titleErrorMsg }}</small>
					</ui-textfield-helper>
				</div>
				<ui-select
					class="field"
					outlined
					required
					disabled
					fullwidth
					:options="options"
				>
					Status
				</ui-select>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { STATUS_OPTIONS } from '@/constants';
import { ref } from 'vue';
import { useSubjectsStore } from '@/stores/subject';

const options = [...STATUS_OPTIONS];
const title = ref('');
const titleErrorMsg = ref('');
const subjectsStore = useSubjectsStore();

function validateTitle() {
	if (title.value) {
		titleErrorMsg.value = '';
	} else {
		titleErrorMsg.value = 'Title is required.';
	}
}
async function save() {
	validateTitle();
	if (!titleErrorMsg.value) {
		try {
			const res = await subjectsStore.createSubject({ title: title.value });
			console.log(res);
		} catch (error) {
			console.error('creating subject failed', error);
			if ((error as Error).message.includes('409')) {
				titleErrorMsg.value = 'Subject already exists.';
			}
		}
	}
}
</script>
<style scoped lang="scss">
@import '@/assets/scss/abstract/variables.scss';

.subject-details {
	background-color: $gray-4;
	padding-bottom: 4px;
	height: calc(100vh - 68px);
	box-sizing: border-box;

	&__main {
		border-radius: 10px 10px 0px 0px;
		background-color: $white;
		height: calc(100vh - 216px);
		border-radius: 10px 10px 0px 0px;
		margin: -48px 24px 4px;
		padding-top: 24px;
		box-sizing: border-box;
		position: relative;
	}
}

.subject-top-container {
	min-height: 188px;
	background-color: $accent;
	padding-top: 40px;
	box-sizing: border-box;
}

h6 {
	color: $white;
}

.subject-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	align-content: center;
	padding-left: 24px;
	padding-right: 24px;

	&__content {
		display: flex;
		align-items: center;

		img {
			height: 18px;
			margin-right: 12px;
		}

		.save-btn {
			background-color: $white;
			color: $gray-1;
		}
	}
}

.tab {
	display: flex;
	border-bottom: 1px solid rgba(0, 0, 0, 0.12);
	cursor: pointer;

	&__item {
		color: $gray-1;
		font-weight: 500;
		padding: 4px 32px 12px;

		&--active {
			border-bottom: 1px solid $gray-87;
			margin-bottom: -1px;
		}
	}
}

.content {
	display: flex;
	justify-content: space-between;
	padding: 40px 20px;
}

.field {
	width: 45%;
}

.title-field {
	width: 100%;
}

.alert {
	color: $error;
	font-size: 12px;
}
</style>
