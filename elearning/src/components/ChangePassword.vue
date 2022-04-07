<template>
	<ui-card class="password-card">
		<h4>eLearning Portal</h4>
		<h6>CHANGE PASSWORD</h6>
		<ui-form>
			<ui-form-field class="form-item">
				<ui-textfield
					id="curr-password"
					v-model="currPassword"
					class="field"
					input-type="password"
					outlined
					:pattern="notBlankFormat"
					helper-text-id="curr-pword-helper-text"
					with-trailing-icon
				>
					Current Password
					<template #after="{ iconClass }">
						<span :class="iconClass">
							<ui-icon outlined>vpn_key</ui-icon>
						</span>
					</template>
				</ui-textfield>
				<ui-textfield-helper
					v-if="currPasswordErrorMsg"
					id="curr-pword-helper-text"
					visible
					validMsg
				>
					<small class="alert">{{ currPasswordErrorMsg }}</small>
				</ui-textfield-helper>
			</ui-form-field>
			<ui-form-field class="form-item">
				<ui-textfield
					id="password"
					v-model="password"
					class="field"
					input-type="password"
					outlined
					:pattern="notBlankFormat"
					helper-text-id="pword-helper-text"
				>
					New Password
				</ui-textfield>
			</ui-form-field>
			<ui-form-field class="form-item">
				<ui-textfield
					id="conf-password"
					v-model="confPassword"
					class="field"
					input-type="password"
					outlined
					:pattern="notBlankFormat"
					helper-text-id="pword-helper-text"
				>
					Confirm Password
				</ui-textfield>
				<ui-textfield-helper
					v-if="passwordErrorMsg"
					id="pword-helper-text"
					visible
					validMsg
				>
					<small class="alert">{{ passwordErrorMsg }}</small>
				</ui-textfield-helper>
			</ui-form-field>
		</ui-form>
		<ui-button
			id="save-btn"
			class="button button--filled"
			unelevated
			:disabled="!password || !confPassword"
			@click="changePassword"
		>
			Save Changes
		</ui-button>
	</ui-card>
	<AlertModal v-if="showSuccessModal">
		<template v-slot:content>
			<p>
				You have successfully changed your password. You may now log in with
				your new password.
			</p>
		</template>
		<template v-slot:actions>
			<ui-button @click="$router.push({ name: 'login' })">Ok</ui-button>
		</template>
	</AlertModal>
</template>
<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import AlertModal from './AlertModal.vue';

const currPassword = ref('');
const currPasswordErrorMsg = ref('');
const password = ref('');
const confPassword = ref('');
const passwordErrorMsg = ref('');
const notBlankFormat = '.{1,}';
const showSuccessModal = ref(false);
const authStore = useAuthStore();

function validatePasswords() {
	if (password.value === confPassword.value) {
		passwordErrorMsg.value = '';
	} else {
		passwordErrorMsg.value = 'Passwords do not match.';
	}
}

async function changePassword() {
	validatePasswords();

	if (!passwordErrorMsg.value) {
		const res = await authStore.changePassword({
			currPassword: currPassword.value,
			password: password.value,
			verifyPassword: confPassword.value,
		});

		if (res?.data.errorMessage) {
			currPasswordErrorMsg.value = res.data.errorMessage;
		}

		if (res?.data.status == 'success') {
			currPasswordErrorMsg.value = '';
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

.form-item {
	margin-bottom: 12px;
	display: block;
}

.field {
	width: 100%;
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
