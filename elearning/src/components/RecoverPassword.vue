<template>
	<ui-card class="password-card">
		<h4>eLearning Portal</h4>
		<h6>RECOVER YOUR PASSWORD</h6>
		<ui-textfield
			id="email"
			v-model.trim="email"
			class="field"
			input-type="email"
			outlined
			with-trailing-icon
			:pattern="emailFormat"
			helper-text-id="email-helper-text"
		>
			Email
			<template #after="{ iconClass }">
				<span :class="iconClass">
					<ui-icon outlined>email</ui-icon>
				</span>
			</template>
		</ui-textfield>
		<ui-textfield-helper
			v-if="emailError"
			id="email-helper-text"
			visible
			validMsg
		>
			<small class="alert">{{ emailErrorMsg }}</small>
		</ui-textfield-helper>
		<ui-button
			id="reset-btn"
			class="button button--filled"
			unelevated
			:disabled="!email"
			@click="sendRequest"
		>
			Send Reset Link
		</ui-button>
	</ui-card>
	<AlertModal v-if="showSuccessModal">
		<template v-slot:content>
			<p>We have sent a reset password link to your registered email.</p>
		</template>
		<template v-slot:actions>
			<ui-button @click="$router.push({ name: 'login' })">Ok</ui-button>
		</template>
	</AlertModal>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import AlertModal from './AlertModal.vue';

const email = ref('');
const emailError = ref(false);
const emailErrorMsg = ref('');
const emailFormat = '[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$';
const authStore = useAuthStore();
const showSuccessModal = ref(false);

function validateEmail() {
	// validate Email input
	if (email.value && email.value.match(emailFormat)) {
		emailError.value = false;
		emailErrorMsg.value = '';
	} else {
		emailError.value = true;
		emailErrorMsg.value = 'Email should be in the format "example@domain.com"';
	}
}

async function sendRequest() {
	validateEmail();
	if (!emailError.value) {
		let data = {
			email: email.value,
		};
		const res = await authStore.requestPasswordReset(data);
		if (!res) {
			emailError.value = true;
			emailErrorMsg.value = 'Email was not found in our records.';
		}
		if (res?.data.status == 'success') {
			showSuccessModal.value = true;
		}
	}
}
</script>
<style scoped lang="scss">
@import '../assets/scss/abstract/variables.scss';

.password-card {
	margin: auto;
	padding: 64px 32px;
}

h4 {
	text-align: center;
}

h6 {
	margin-top: 24px;
	margin-bottom: 24px;
	text-align: center;
}

.field {
	margin-bottom: 12px;
}

.alert {
	color: $error;
	font-size: 12px;
}

.button {
	align-self: center;
	margin-top: 12px;
	margin-bottom: 12px;
	text-transform: none;

	&--filled {
		width: 70%;
		text-transform: uppercase;
	}
}
</style>
