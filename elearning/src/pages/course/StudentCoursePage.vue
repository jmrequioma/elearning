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
					<ui-textfield v-model.trim="search" outlined
						>Search for a course</ui-textfield
					>
				</div>
				<div class="course-filters__content">
					<ui-select
						v-model="selectedSubject"
						outlined
						fullwidth
						:options="subjectOptions"
						>Subject</ui-select
					>
					<ui-select
						v-model="selectedInstructor"
						outlined
						fullwidth
						:options="instructorOptions"
						>Instructor</ui-select
					>
				</div>
			</div>
			<div class="course-content">
				<template v-for="course in courses" :key="course.id">
					<CourseCard
						:course="course"
						action="enroll"
						@handle-action="handleAction"
					/>
				</template>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import { useSubjectsStore } from '@/stores/subject';
import { useUsersStore } from '@/stores/user';
import { useCoursesStore } from '@/stores/course';
import { useEnrollmentsStore } from '@/stores/enrollment';
import type { EmitCourseAction, Subject, User } from '@/types';
import _ from 'lodash';

import CourseCard from '@/components/CourseCard.vue';

const subjectStore = useSubjectsStore();
const userStore = useUsersStore();
const courseStore = useCoursesStore();
const enrollmentStore = useEnrollmentsStore();
const subjects = ref<Subject[]>([]);
const selectedSubject = ref(-1);
const instructors = ref<User[]>([]);
const selectedInstructor = ref(-1);
const courses = ref([]);
const search = ref('');

const subjectOptions = computed(() => {
	const options: Array<object> = [];
	// push an "All" option first
	options.push({ label: 'All', value: -1 });
	subjects.value.forEach((subject) => {
		const option = {
			label: subject.title,
			value: subject.id,
		};
		options.push(option);
	});
	return options;
});

const instructorOptions = computed(() => {
	const options: Array<object> = [];
	// push an "All" option first
	options.push({ label: 'All', value: -1 });
	instructors.value.forEach((instructor) => {
		const option = {
			label: `${instructor.firstName} ${instructor.lastName}`,
			value: instructor.id,
		};
		options.push(option);
	});
	return options;
});

watch(
	[selectedSubject, selectedInstructor, search],
	_.debounce(() => {
		fetchCourses();
	}, 500)
);

onMounted(() => {
	fetchSubjects();
	fetchInstructors();
	fetchCourses();
});

async function fetchSubjects() {
	try {
		const res = await subjectStore.fetchDropdownSubjects({ full: true });
		if (res) {
			subjects.value = res.data;
		}
	} catch (error) {
		console.error('fetching subjects dropdown failed.', error);
	}
}

async function fetchInstructors() {
	try {
		const res = await userStore.fetchUsers({ full: true, role: 'instructor' });
		if (res) {
			instructors.value = res.data;
		}
	} catch (error) {
		console.error('fetching instructors dropdown failed.', error);
	}
}

async function fetchCourses() {
	type filter = {
		full: boolean;
		keyword: string;
		isPublished: boolean;
		subjectId?: number;
		authorId?: number;
	};

	let data: filter = {
		full: true,
		keyword: search.value,
		isPublished: true,
	};

	if (selectedSubject.value != -1) {
		data['subjectId'] = selectedSubject.value;
	}

	if (selectedInstructor.value != -1) {
		data['authorId'] = selectedInstructor.value;
	}

	try {
		const res = await courseStore.fetchCourses(data);
		if (res) {
			courses.value = res.data;
		}
	} catch (error) {
		console.error('fetching courses failed.', error);
	}
}

function handleAction(emittedAction: EmitCourseAction) {
	const { courseId, action } = emittedAction;

	if (action === 'enroll') {
		enroll(courseId);
	}
}

async function enroll(courseId: number) {
	try {
		const res = await enrollmentStore.createEnrollment({ courseId: courseId });

		if (res) {
			fetchCourses();
		}
	} catch (error) {
		console.error('error in enrolling into a course', error);
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
