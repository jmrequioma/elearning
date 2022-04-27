<template>
	<div class="card">
		<div class="card__header">
			<div class="card__header__content">
				{{ course?.subject?.title }}
				<div class="card__header__duration">
					<ui-icon>schedule</ui-icon>
					{{ course?.duration }} min
				</div>
			</div>
		</div>
		<div class="card__content">
			<img :src="course?.icon" alt="course-image" class="course-image" />
			<div class="title">
				{{ course?.title }}
			</div>
			<div class="desc">
				{{ course?.author }}
			</div>
			<div class="desc">
				{{ getDate(course?.createdAt) }}
			</div>
		</div>
		<div class="card__action">
			<ui-button @click="handleAction">{{ action }}</ui-button>
		</div>
	</div>
</template>
<script setup lang="ts">
import type { Course } from '@/types';
import type { PropType } from 'vue';
import moment from 'moment';

const props = defineProps({
	course: Object as PropType<Course>,
	action: String,
	enrollmentId: {
		type: Number,
		required: false,
		default: -1,
	},
});

const emit = defineEmits(['handleAction']);

function getDate(date: string) {
	const newDate = new Date(date);
	return `Created ${moment(newDate).format('MMM D, yyyy')}`;
}

function handleAction() {
	emit('handleAction', {
		courseId: props.course?.id,
		enrollmentId: props.enrollmentId,
		action: props.action,
	});
}
</script>
<style scoped lang="scss">
@import '../assets/scss/abstract/variables.scss';

.card {
	width: 300px;
	height: 256px;
	border-radius: 10px 10px 5px 5px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
	font-size: 14px;

	&__header {
		border-radius: 10px 10px 0 0;
		background-color: $accent;
		height: 60px;
		display: flex;
		padding-left: 16px;
		padding-right: 16px;
		align-items: center;

		&__content {
			color: $white-4;
			display: flex;
			width: 100%;
			justify-content: space-between;
			align-items: center;
		}

		&__duration {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 80px;
		}
	}

	&__content {
		text-align: center;
	}

	&__action {
		display: flex;
		justify-content: center;
		border-top: 1px solid $gray-2;

		:deep(.mdc-button .mdc-button__label) {
			color: $accent;
		}
	}
}

.course-image {
	height: 80px;
	width: 156px;
}

.title {
	font-weight: 500;
	margin-top: 4px;
	margin-bottom: 4px;
}

.desc {
	color: $gray-1;
	font-size: 12px;
	margin-top: 4px;
	margin-bottom: 4px;

	&:last-child {
		margin-bottom: 12px;
	}
}
</style>
