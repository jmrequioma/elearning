<template>
	<div class="page">
		<div v-if="currentLesson" class="current-lesson">
			<h4 class="header">Current Lesson</h4>
			<div class="current-lesson__content">
				<img
					:src="currentLesson.course.icon"
					alt="course-icon"
					class="course-image"
				/>
				<ui-icon>arrow_forward</ui-icon>
				<h6 class="module-title">
					{{ currentLesson.course.modules[0].title }}
				</h6>
			</div>
		</div>
		<div class="my-courses">
			<h4 class="header">My Courses</h4>
			<div class="my-courses__content">
				<div class="scroll-container">
					<template v-for="enrollment in enrollments" :key="enrollment.id">
						<CourseCard
							:course="enrollment.course"
							:action="getAction(enrollment)"
							@handle-action="handleAction"
						/>
					</template>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useEnrollmentsStore } from '@/stores/enrollment';
import type { Enrollment, EmitCourseAction } from '@/types';
import { useRouter } from 'vue-router';

import CourseCard from '@/components/CourseCard.vue';

const enrollmentStore = useEnrollmentsStore();

const enrollments = ref<Enrollment[]>([]);
const router = useRouter();

const currentLesson = computed(() => {
	return enrollments.value.find((enrollment) => {
		return enrollment.isStarted;
	});
});

onMounted(() => {
	fetchEnrollments();
});

async function fetchEnrollments() {
	try {
		const res = await enrollmentStore.fetchEnrollments({ full: true });
		enrollments.value = res.data.data;
	} catch (error) {
		console.error('error in fetching enrollments.', error);
	}
}

function handleAction(emittedAction: EmitCourseAction) {
	const { courseId, action } = emittedAction;

	if (action === 'start' || action === 'continue') {
		router.push({ name: 'view-course', params: { id: courseId } });
	}
}

function getAction(enrollment: Enrollment) {
	return enrollment.isStarted ? 'continue' : 'start';
}
</script>
<style scoped lang="scss">
@import '@/assets/scss/abstract/variables.scss';

.page {
	padding: 40px;
}

.header {
	color: $accent;
}

.current-lesson {
	&__content {
		display: flex;
		column-gap: 12px;
		align-items: center;
		padding-top: 20px;
		padding-bottom: 80px;
	}
}

.my-courses {
	&__content {
		padding-top: 20px;
		row-gap: 40px;
	}
}

.scroll-container {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	row-gap: 40px;
	height: 340px;
	padding: 4px;
	overflow-y: scroll;
}

.course-image {
	height: 80px;
	width: 156px;
}

.module-title {
	color: $black;
}
</style>
