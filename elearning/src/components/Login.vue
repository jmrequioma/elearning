<template>
	<ui-card class="login-card">
		<h4>eLearning Portal</h4>
		<h6>LOGIN TO YOUR ACCOUNT</h6>
		<ui-textfield
			id="email"
			v-model="email"
			class="field"
			outlined
			with-trailing-icon
		>
			Email
			<template #after="{ iconClass }">
				<span :class="iconClass">
					<ui-icon outlined>email</ui-icon>
				</span>
			</template>
		</ui-textfield>
		<ui-textfield
			v-model="password"
			id="password"
			class="field"
			input-type="password"
			outlined
			with-trailing-icon
		>
			Password
			<template #after="{ iconClass }">
				<span :class="iconClass">
					<ui-icon outlined>vpn_key</ui-icon>
				</span>
			</template>
		</ui-textfield>
		<p v-if="invalidCreds" class="alert">Invalid Credentials.</p>
		<router-link class="link link--secondary" :to="{ name: 'login' }">
			Forgot Password
		</router-link>
		<ui-button
			id="login-btn"
			class="button button--filled"
			unelevated
			:disabled="!fieldsAreFilled"
			@click="login"
		>
			Login
		</ui-button>
		<div class="separator">
			<div class="line"></div>
			<p>OR</p>
			<div class="line"></div>
		</div>
		<router-link class="link" :to="{ name: 'create-account' }"
			>Create an account
		</router-link>
	</ui-card>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';

const email = ref('');
const password = ref('');
const invalidCreds = ref(false);

const authStore = useAuthStore();

const fieldsAreFilled = computed(() => {
	return email.value && password.value;
});

watch([email, password], () => {
	// reset alert
	invalidCreds.value = false;
});

async function login() {
	let data = {
		email: email.value,
		password: password.value,
	};
	const res = await authStore.login(data);
	if (!res) {
		invalidCreds.value = true;
	}
}
</script>
<style scoped lang="scss">
@import '../assets/scss/abstract/variables.scss';
.login-card {
	margin: auto;
	padding: 64px 32px;
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

h6 {
	margin-top: 24px;
	margin-bottom: 24px;
	text-align: center;
}

.field {
	margin-top: 16px;
}

.link {
	text-decoration: none;
	align-self: center;
	color: $primary;
	font-weight: 500;
	cursor: pointer;

	&--secondary {
		font-size: 14px;
		color: $gray-1;
		text-align: right;
		margin-top: 24px;
		margin-bottom: 12px;
		align-self: unset;
	}
}

.alert {
	color: $error;
	font-size: 12px;
}

.separator {
	display: flex;
	align-items: center;
	justify-content: center;

	p {
		margin-left: 4px;
		margin-right: 4px;
		color: $gray-1;
		font-size: 16px;
	}
	.line {
		height: 1px;
		width: 32px;
		background-color: $gray-2;
	}
}
</style>
