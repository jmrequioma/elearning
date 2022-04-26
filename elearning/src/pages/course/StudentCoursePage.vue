<template>
	<div class="student-course">
		<div class="course-top-container">
			<div class="course-header">
				<div class="course-header__content">
					<h4 class="course-header__head">Welcome to the eLearning portal</h4>
					<p class="course-header__body">
						Our course will step you through the process of building a small
						application, or adding a new feature to an existing application
					</p>
				</div>
			</div>
		</div>
		<div class="course-main">
			<div class="course-filters">
				<div class="course-filters__content">
					<ui-textfield outlined>Search for a course</ui-textfield>
				</div>
				<div class="course-filters__content">
					<ui-select outlined fullwidth>Subject</ui-select>
					<ui-select outlined fullwidth>Instructor</ui-select>
				</div>
			</div>
			<div class="course-content">
				<template v-for="course in courses" :key="course.id">
					<CourseCard :course="course" />
				</template>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useCoursesStore } from '@/stores/course';

import CourseCard from '@/components/CourseCard.vue';

const courseStore = useCoursesStore();
const courses = ref([]);
const search = ref('');

onMounted(() => {
	fetchCourses();
});

async function fetchCourses() {
	type filter = {
		full: boolean;
		keyword: string;
		isPublished: boolean;
	};

	let data: filter = {
		full: true,
		keyword: search.value,
		isPublished: true,
	};

	const res = await courseStore.fetchCourses(data);
	if (res) {
		courses.value = res.data;
	}
}
</script>
<style scoped lang="scss">
@import '@/assets/scss/abstract/variables.scss';

.course-top-container {
	min-height: 188px;
	background-color: $accent;
	padding-top: 32px;
	box-sizing: border-box;
}

.course-header {
	display: flex;
	justify-content: center;
	color: $gray-6;

	&__head {
		text-align: center;
	}

	&__body {
		text-align: center;
		max-width: 524px;
		line-height: 1.5;
	}
}

.course-main {
	margin: 40px 24px 0;
}

.course-filters {
	display: flex;
	justify-content: space-between;
	margin-bottom: 32px;
	padding-left: 4px;
	padding-right: 4px;

	&__content {
		display: flex;
		justify-content: space-between;
		column-gap: 20px;
	}
}

.course-content {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	row-gap: 40px;
	height: 340px;
	padding: 4px;
	overflow-y: scroll;
}
</style>
