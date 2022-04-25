<template>
	<ui-card class="password-card">
		<h4>eLearning Portal</h4>
		<h6>SET PASSWORD</h6>
		<ui-textfield
			id="password"
			v-model.trim="password"
			class="field"
			input-type="password"
			outlined
			:pattern="notBlankFormat"
			helper-text-id="pword-helper-text"
			with-trailing-icon
		>
			Password
			<template #after="{ iconClass }">
				<span :class="iconClass">
					<ui-icon outlined>vpn_key</ui-icon>
				</span>
			</template>
		</ui-textfield>
		<ui-textfield
			id="conf-password"
			v-model.trim="confPassword"
			class="field"
			input-type="password"
			outlined
			:pattern="notBlankFormat"
			helper-text-id="pword-helper-text"
		>
			Confirm Password
		</ui-textfield>
		<ui-textfield-helper
			v-if="passwordError"
			id="pword-helper-text"
			visible
			validMsg
		>
			<small class="alert">{{ passwordErrorMsg }}</small>
		</ui-textfield-helper>
		<ui-button
			id="save-btn"
			class="button button--filled"
			unelevated
			:disabled="!password || !confPassword"
			@click="setPassword"
		>
			Save Changes
		</ui-button>
	</ui-card>
	<AlertModal v-if="showSuccessModal">
		<template v-slot:content>
			<p>
				You have successfully activated your account. You may now log in with
				your new password.
			</p>
		</template>
		<template v-slot:actions>
			<ui-button @click="router.push({ name: 'login' })">Ok</ui-button>
		</template>
	</AlertModal>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import AlertModal from './AlertModal.vue';

const password = ref('');
const confPassword = ref('');
const passwordError = ref(false);
const passwordErrorMsg = ref('');
const notBlankFormat = '.{1,}';
const showSuccessModal = ref(false);
const router = useRouter();

function validatePasswords() {
	if (password.value === confPassword.value) {
		passwordError.value = false;
		passwordErrorMsg.value = '';
	} else {
		passwordError.value = true;
		passwordErrorMsg.value = 'Passwords do not match.';
	}
}

async function setPassword() {
	validatePasswords();
	// the user's email should be derived from the link given by the backend
	if (!passwordError.value) {
		showSuccessModal.value = true;
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
