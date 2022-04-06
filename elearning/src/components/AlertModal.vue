<template>
	<div class="modal">
		<div class="modal__content">
			<slot name="content"></slot>
			<div class="modal__actions">
				<slot name="actions"></slot>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts"></script>
<style scoped lang="scss">
@import '../assets/scss/abstract/variables.scss';
.modal {
	display: flex;
	position: fixed; /* Stay in place */
	z-index: 7; /* Sit on top */
	left: 0;
	top: 0;
	width: 100%; /* Full width */
	height: 100%; /* Full height */
	overflow: auto; /* Enable scroll if needed */
	background-color: rgb(0, 0, 0); /* Fallback color */
	background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */

	&__content {
		background-color: $white;
		margin: auto;
		padding: 20px;
		border-radius: 6px;
		width: 30%; /* Could be more or less, depending on screen size */
		min-width: 200px;
	}

	&__actions {
		display: flex;
		justify-content: end;
	}
}
</style>
