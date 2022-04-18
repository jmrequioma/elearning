<template>
	<div class="subject-details">
		<div class="subject-top-container">
			<div class="subject-header">
				<div class="subject-header__content">
					<img src="@/assets/media/bookshelf.png" alt="bookshelf-icon" />
					<h6>{{ headerTitle }}</h6>
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
						@keyup.enter="save"
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
					v-model="selectedStatus"
					outlined
					required
					:disabled="isAddSubjectRoute"
					fullwidth
					:options="options"
				>
					Status
				</ui-select>
			</div>
		</div>
		<AlertModal v-if="showSuccessModal">
			<template v-slot:content>
				<p>{{ successMessage }}</p>
			</template>
			<template v-slot:actions>
				<ui-button @click="$router.push({ name: 'subjects' })">Ok</ui-button>
			</template>
		</AlertModal>
	</div>
</template>
<script setup lang="ts">
import { STATUS_OPTIONS } from '@/constants';
import { computed, onMounted, ref, reactive, watch } from 'vue';
import { useSubjectsStore } from '@/stores/subject';
import AlertModal from '@/components/AlertModal.vue';
import { useRoute, onBeforeRouteLeave } from 'vue-router';
import type { Subject } from '@/types';

const options = [...STATUS_OPTIONS];
const title = ref('');
const selectedStatus = ref('');
const titleErrorMsg = ref('');
const subjectsStore = useSubjectsStore();
const showSuccessModal = ref(false);
const route = useRoute();
const subjectId = ref(0);
let fetchedSubject: Subject = reactive({
	id: subjectId,
	title: '',
	isPublished: false,
	createdAt: '',
	updatedAt: '',
	ownerId: 0,
});

const headerTitle = computed(() => {
	if (isAddSubjectRoute.value) {
		return 'Add a subject';
	} else {
		return fetchedSubject.title;
	}
});

const isAddSubjectRoute = computed(() => {
	return route.name?.toString() === 'add-subject';
});

const successMessage = computed(() => {
	if (isAddSubjectRoute.value) {
		return `Successfully created a subject named ${title.value}.`;
	} else {
		return 'Subject is successfully updated.';
	}
});

const unsavedChanges = computed(() => {
	const status = selectedStatus.value === 'Draft' ? false : true;
	if (!isAddSubjectRoute.value) {
		return (
			title.value != fetchedSubject.title ||
			status != fetchedSubject.isPublished
		);
	}
	return false;
});

onMounted(() => {
	// check if page is for adding or editing
	if (!isAddSubjectRoute.value) {
		const id = route.params.id;
		subjectId.value = parseInt(id.toString());
		// fetch specific subject
		fetchSpecificSubject();
	}
});

function validateTitle() {
	if (title.value) {
		titleErrorMsg.value = '';
	} else {
		titleErrorMsg.value = 'Title is required.';
	}
}

async function createSubject() {
	try {
		const res = await subjectsStore.createSubject({ title: title.value });
		if (res) {
			showSuccessModal.value = true;
		}
	} catch (error) {
		console.error('creating subject failed', error);
		if ((error as Error).message.includes('409')) {
			titleErrorMsg.value = 'Subject already exists.';
		}
	}
}

function save() {
	validateTitle();
	if (!titleErrorMsg.value) {
		if (isAddSubjectRoute.value) {
			createSubject();
		} else {
			editSubject();
		}
	}
}

async function fetchSpecificSubject() {
	const data = { id: subjectId.value };
	// fetch specific subject
	try {
		const res = await subjectsStore.fetchSubjectDetails(data);
		fetchedSubject.title = res.data.title;
		fetchedSubject.isPublished = res.data.isPublished;
		// set the text field models
		title.value = res.data.title;
		selectedStatus.value = res.data.isPublished ? 'Published' : 'Draft';
	} catch (error) {
		console.error('fetching specific subject failed', error);
	}
}

async function editSubject() {
	try {
		let data = {
			id: fetchedSubject.id,
			title: title.value,
			isPublished: selectedStatus.value === 'Draft' ? false : true,
		};
		const res = await subjectsStore.updateSubject(data);
		if (res) {
			showSuccessModal.value = true;
		}
	} catch (error) {
		console.error('editing specific subject failed', error);
	}
}

onBeforeRouteLeave((to, from) => {
	if (unsavedChanges.value) {
		const answer = window.confirm(
			'Do you really want to leave? you have unsaved changes!'
		);
		// cancel the navigation and stay on the same page
		if (!answer) return false;
	}
});
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
