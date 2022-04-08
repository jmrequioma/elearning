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
			<table class="subjects-table">
				<tr>
					<th>Title</th>
					<th>Courses</th>
					<th>Status</th>
				</tr>
				<tr>
					<td>Frontend Development</td>
					<td>2 Courses</td>
					<td class="row-action">
						Published
						<ui-icon-button icon="more_vert"></ui-icon-button>
					</td>
				</tr>
				<tr>
					<td>UI/UX</td>
					<td>6 Courses</td>
					<td class="row-action">
						Draft
						<ui-icon-button icon="more_vert"></ui-icon-button>
					</td>
				</tr>
				<tr>
					<td>Backend Development</td>
					<td>4 Courses</td>
					<td class="row-action">
						Draft
						<ui-icon-button icon="more_vert"></ui-icon-button>
					</td>
				</tr>
				<tr>
					<td>Backend Development</td>
					<td>4 Courses</td>
					<td class="row-action">
						Draft
						<ui-icon-button icon="more_vert"></ui-icon-button>
					</td>
				</tr>
				<tr>
					<td>Backend Development</td>
					<td>4 Courses</td>
					<td class="row-action">
						Draft
						<ui-icon-button icon="more_vert"></ui-icon-button>
					</td>
				</tr>
				<tr>
					<td>Backend Development</td>
					<td>4 Courses</td>
					<td class="row-action">
						Draft
						<ui-icon-button icon="more_vert"></ui-icon-button>
					</td>
				</tr>
				<tr>
					<td>Backend Development</td>
					<td>4 Courses</td>
					<td class="row-action">
						Draft
						<ui-icon-button icon="more_vert"></ui-icon-button>
					</td>
				</tr>
				<tr>
					<td>Backend Development</td>
					<td>4 Courses</td>
					<td class="row-action">
						Draft
						<ui-icon-button icon="more_vert"></ui-icon-button>
					</td>
				</tr>
				<tr>
					<td>Backend Development</td>
					<td>4 Courses</td>
					<td class="row-action">
						Draft
						<ui-icon-button icon="more_vert"></ui-icon-button>
					</td>
				</tr>
				<tr>
					<td>Backend Development</td>
					<td>4 Courses</td>
					<td class="row-action">
						Draft
						<ui-icon-button icon="more_vert"></ui-icon-button>
					</td>
				</tr>
				<tr>
					<td>Backend Development</td>
					<td>4 Courses</td>
					<td class="row-action">
						Draft
						<ui-icon-button icon="more_vert"></ui-icon-button>
					</td>
				</tr>
			</table>
		</div>
	</div>
</template>
<script setup lang="ts"></script>
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
	overflow-y: scroll;
}

.subjects-table {
	width: 100%;
	color: $gray-1;
	border-spacing: 0;

	th {
		padding: 12px 32px;
		text-align: left;
		border-bottom: 2px solid $gray-5;
	}

	td {
		padding-left: 32px;
		padding-right: 12px;
		text-align: left;
		border-bottom: 2px solid $gray-5;
	}

	.row-action {
		display: flex;
		align-items: center;
		align-content: center;
		justify-content: space-between;
	}
}
</style>
