<template>
	<div class="subject-page">
		<div class="subject-top-container">
			<div class="subject-header">
				<div class="subject-header__content">
					<img src="@/assets/media/bookshelf.png" alt="bookshelf-icon" />
					<h6>Subjects</h6>
				</div>
				<div class="subject-header__content">
					<ui-textfield class="search" with-leading-icon>
						Search
						<template #before="{ iconClass }">
							<span :class="iconClass">
								<ui-icon>search</ui-icon>
							</span>
						</template>
					</ui-textfield>
					<ui-icon-button
						class="filter-btn"
						icon="filter_list"
					></ui-icon-button>
				</div>
				<div class="subject-header__content">
					<ui-button class="add-subject-btn" unelevated
						>Add New Subject</ui-button
					>
				</div>
			</div>
		</div>
		<div class="subject-main">
			<div class="table-container">
				<table class="subjects-table">
					<tr>
						<th>Title</th>
						<th>Courses</th>
						<th>Status</th>
					</tr>
					<tr v-for="i in selectedOption" :key="i">
						<td>Frontend Development</td>
						<td>2 Courses</td>
						<td class="row-action">
							Published
							<ui-icon class="icon">more_vert</ui-icon>
						</td>
					</tr>
				</table>
			</div>
			<div class="table-control">
				<div class="table-control__container">
					<div class="table-control__dropdown">
						<label for="cars">Items per page:</label>
						<div class="select">
							<select name="cars" v-model="selectedOption">
								<option v-for="option in options" :value="option" :key="option">
									{{ option }}
								</option>
							</select>
						</div>
					</div>
					<div class="table-control__pagination">
						1 - 10 of 20
						<ui-icon class="icon icon--disabled">navigate_before</ui-icon>
						<ui-icon class="icon">navigate_next</ui-icon>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { PAGINATION_OPTIONS } from '@/constants';
import { ref } from 'vue';

const options = PAGINATION_OPTIONS;
const selectedOption = ref(options[0]);
</script>
<style scoped lang="scss">
@import '../assets/scss/abstract/variables.scss';

.subject-page {
	background-color: $gray-4;
	padding-bottom: 4px;
	height: calc(100vh - 68px);
	box-sizing: border-box;
}

.subject-top-container {
	min-height: 188px;
	background-color: $accent;
	padding-top: 32px;
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

		.filter-btn {
			border-radius: 30px;
			background-color: $white;
			color: $gray-2;
			margin-left: 12px;
		}

		.add-subject-btn {
			background-color: $white;
			color: $gray-1;
		}
	}
}

.search {
	border-radius: 25px;
	background-color: $white;
	width: 332px;
}

.subject-main {
	border-radius: 10px 10px 0px 0px;
	background-color: $white;
	height: calc(100vh - 216px);
	border-radius: 10px 10px 0px 0px;
	margin: -48px 24px 4px;
	padding-top: 24px;
	box-sizing: border-box;
	position: relative;
}

.table-container {
	overflow-y: auto;
	margin-right: 20px;
	height: 85%;
}

.icon {
	color: $gray-1;
	cursor: pointer;

	&--disabled {
		color: $gray-2;
	}
}

.subjects-table {
	width: 100%;
	color: $gray-1;
	border-spacing: 0;

	th {
		padding: 12px 32px;
		text-align: left;
		border-bottom: 2px solid $gray-5;
		box-sizing: border-box;

		&:nth-child(2) {
			width: 240px;
		}

		&:nth-child(3) {
			width: 220px;
		}
	}

	td {
		padding: 12px 12px 12px 32px;
		text-align: left;
		border-bottom: 2px solid $gray-5;
		max-height: 40px;
	}

	.row-action {
		display: flex;
		align-items: center;
		align-content: center;
		justify-content: space-between;
	}
}

.table-control {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	position: absolute;
	font-size: 12px;
	border-top: 1px solid $gray-4;
	width: 100%;
	bottom: 0;
	height: 40px;

	p,
	label {
		color: $gray-2;
	}

	&__container {
		display: flex;
		align-items: center;
		align-content: center;
		padding-right: 24px;
		width: 332px;
		justify-content: space-between;
	}

	&__dropdown {
		display: flex;
		align-items: center;
	}

	&__pagination {
		display: flex;
		width: 140px;
		justify-content: space-between;
		color: $gray-2;
		align-items: center;
	}
}

select {
	// A reset of styles, including removing the default dropdown arrow
	appearance: none;
	background-color: transparent;
	border: none;
	padding: 4px 24px 4px 0;
	margin: 0;
	width: 100%;
	font-family: inherit;
	font-size: 12px;
	border-bottom: 1px solid $gray-1;
	color: $gray-1;
	cursor: inherit;
	line-height: inherit;

	// Stack above custom arrow
	z-index: 1;
	&::-ms-expand {
		display: none;
	}

	// Remove focus outline, will add on alternate element
	outline: none;

	// Custom arrow
	&:not(.select--multiple)::after {
		content: '';
		justify-self: end;
		width: 0.8em;
		height: 0.5em;
		background-color: var(--select-arrow);
		clip-path: polygon(100% 0%, 0 0%, 50% 100%);
	}
}

.select {
	display: grid;
	grid-template-areas: 'select';
	align-items: center;
	font-size: 12px;
	position: relative;

	select {
		grid-area: select;
	}

	padding: 0.25em 0.5em;

	font-size: 1.25rem;
	cursor: pointer;
	line-height: 1.1;

	// Custom arrow
	&::after {
		grid-area: select;
		content: '';
		justify-self: end;
		width: 10px;
		height: 6px;
		background-color: $gray-1;
		clip-path: polygon(100% 0%, 0 0%, 50% 100%);
	}
}
</style>
