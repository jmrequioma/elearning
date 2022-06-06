<template>
	<ui-card class="account-card">
		<h4>eLearning Portal</h4>
		<h6>CREATE AN ACCOUNT</h6>
		<ui-form>
			<ui-form-field class="form-item">
				<ui-select
					id="role"
					v-model.trim="selectedRole"
					class="field"
					:options="options"
					outlined
					fullwidth
				>
					Role
				</ui-select>
			</ui-form-field>
			<ui-form-field class="form-item">
				<ui-textfield
					id="email"
					v-model.trim="email"
					class="field"
					input-type="email"
					outlined
					with-trailing-icon
					required
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
					v-if="emailErrorMsg"
					id="email-helper-text"
					visible
					validMsg
				>
					<small class="alert">{{ emailErrorMsg }}</small>
				</ui-textfield-helper>
			</ui-form-field>
			<ui-form-field class="form-item">
				<ui-textfield
					id="first-name"
					v-model.trim="firstName"
					class="field"
					outlined
					required
				>
					First Name
				</ui-textfield>
			</ui-form-field>
			<ui-form-field class="form-item">
				<ui-textfield
					id="last-name"
					v-model.trim="lastName"
					class="field"
					outlined
					required
				>
					Last Name
				</ui-textfield>
			</ui-form-field>
			<ui-form-field class="form-item">
				<ui-textfield
					id="password"
					v-model="password"
					class="field"
					input-type="password"
					outlined
					required
					:pattern="notBlankFormat"
					with-trailing-icon
				>
					Password
					<template #after="{ iconClass }">
						<span :class="iconClass">
							<ui-icon outlined>vpn_key</ui-icon>
						</span>
					</template>
				</ui-textfield>
			</ui-form-field>
			<ui-form-field class="form-item">
				<ui-textfield
					id="conf-password"
					v-model="confPassword"
					class="field"
					input-type="password"
					outlined
					required
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
					@keyup.enter="register"
				>
					<small class="alert">{{ passwordErrorMsg }}</small>
				</ui-textfield-helper>
			</ui-form-field>
			<ui-alert v-if="emailErrorMsg || passwordErrorMsg" state="error"
				>One or more fields contain invalid values.</ui-alert
			>
		</ui-form>
		<ui-button
			id="register-btn"
			class="button button--filled"
			unelevated
			:disabled="!fieldsAreFilled"
			@click="register"
		>
			Register
		</ui-button>
	</ui-card>
	<AlertModal v-if="accountCreated">
		<template v-slot:content>
			<p>
				{{ dialogText }}
			</p>
		</template>
		<template v-slot:actions>
			<ui-button @click="router.push({ name: 'login' })">Ok</ui-button>
		</template>
	</AlertModal>
</template>
<script setup lang="ts">
import { ROLES } from '@/constants';
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

import AlertModal from './AlertModal.vue';

const selectedRole = ref('');
const options = [...ROLES];
const email = ref('');
const emailErrorMsg = ref('');
const firstName = ref('');
const lastName = ref('');
const password = ref('');
const passwordErrorMsg = ref('');
const confPassword = ref('');
const accountCreated = ref(false);

const emailFormat = '[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$';
const notBlankFormat = '.{1,}';

const authStore = useAuthStore();
const router = useRouter();
const fieldsAreFilled = computed(() => {
	return (
		selectedRole.value &&
		email.value &&
		firstName.value &&
		lastName.value &&
		password.value &&
		confPassword.value
	);
});

const dialogText = computed(() => {
	let role = selectedRole.value === 'student' ? 'a student' : 'an instructor';
	return `You’ve successfully registered as ${role}. Please check your email
				to activate your account.`;
});

function validateEmail() {
	// validate Email input
	if (email.value && email.value.match(emailFormat)) {
		emailErrorMsg.value = '';
	} else {
		emailErrorMsg.value = 'Email should be in the format "example@domain.com"';
	}
}

function validatePasswords() {
	if (password.value === confPassword.value) {
		passwordErrorMsg.value = '';
	} else {
		passwordErrorMsg.value = 'Passwords do not match.';
	}
}

async function register() {
	// validate user inputs
	validateEmail();
	validatePasswords();

	if (!emailErrorMsg.value && !passwordErrorMsg.value) {
		// validation passed, register new user now
		const data = {
			email: email.value,
			password: password.value,
			verifyPassword: confPassword.value,
			role: selectedRole.value,
			firstName: firstName.value,
			lastName: lastName.value,
		};

		const res = await authStore.signup(data);
		if (res?.data.errorMessage === 'The email is already registered.') {
			emailErrorMsg.value = 'The email is already registered.';
		} else {
			// show alert modal
			emailErrorMsg.value = '';
			accountCreated.value = true;
		}
	}
}
</script>
<style scoped lang="scss">
@import '../assets/scss/abstract/variables.scss';

.account-card {
	margin: auto;
	padding: 64px 32px;
	max-width: 90%;
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

h4 {
	text-align: center;
}

h6 {
	margin-top: 24px;
	margin-bottom: 24px;
	text-align: center;
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

.mdc-text-field + .mdc-text-field-helper-line {
	padding-left: 12px;
}
</style>
