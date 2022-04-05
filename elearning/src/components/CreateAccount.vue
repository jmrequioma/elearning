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
					v-if="emailError"
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
					helper-text-id="fname-helper-text"
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
					helper-text-id="lname-helper-text"
				>
					Last Name
				</ui-textfield>
			</ui-form-field>
			<ui-form-field class="form-item">
				<ui-textfield
					id="password"
					v-model.trim="password"
					class="field"
					input-type="password"
					outlined
					required
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
			</ui-form-field>
			<ui-form-field class="form-item">
				<ui-textfield
					id="conf-password"
					v-model.trim="confPassword"
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
					v-if="passwordError"
					id="lname-helper-text"
					visible
					validMsg
				>
					<small class="alert">{{ passwordErrorMsg }}</small>
				</ui-textfield-helper>
			</ui-form-field>
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
</template>
<script setup lang="ts">
import { ROLES } from '@/constants';
import { ref, computed } from 'vue';

const selectedRole = ref('');
const options = [...ROLES];
const email = ref('');
const emailError = ref(false);
const emailErrorMsg = ref('');
const firstName = ref('');
const lastName = ref('');
const password = ref('');
const passwordError = ref(false);
const passwordErrorMsg = ref('');
const confPassword = ref('');

const emailFormat = '[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$';
const notBlankFormat = '.{1,}';

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

function validatePasswords() {
	if (password.value === confPassword.value) {
		passwordError.value = false;
		passwordErrorMsg.value = '';
	} else {
		passwordError.value = true;
		passwordErrorMsg.value = 'Passwords do not match.';
	}
}

function register() {
	// validate user inputs
	validateEmail();
	validatePasswords();

	if (!emailError.value && !passwordError.value) {
		// validation passed, register new user now
	}
}
</script>
<style scoped lang="scss">
@import '../assets/scss/abstract/variables.scss';

.account-card {
	margin: auto;
	padding: 64px 32px;
	min-width: 400px;
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
