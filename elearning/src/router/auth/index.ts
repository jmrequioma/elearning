export default [
	{
		path: '/',
		component: () => import('@/pages/LandingPage.vue'),
		children: [
			{
				path: '',
				name: 'login',
				component: () => import('@/components/Login.vue'),
				meta: {
					title: 'Login - E-Learning',
					authRequired: false,
					hideWhenAuthenticated: true,
					allowedRoles: ['admin', 'instructor', 'student'],
				},
			},
			{
				path: '/create-account',
				name: 'create-account',
				component: () => import('@/components/CreateAccount.vue'),
				meta: {
					title: 'Create an account - E-Learning',
					authRequired: false,
					hideWhenAuthenticated: true,
					allowedRoles: ['admin', 'instructor', 'student'],
				},
			},
			{
				path: '/recover-password',
				name: 'recover-password',
				component: () => import('@/components/RecoverPassword.vue'),
				meta: {
					title: 'Password Recovery - E-Learning',
					authRequired: false,
					hideWhenAuthenticated: true,
					allowedRoles: ['admin', 'instructor', 'student'],
				},
			},
			{
				path: '/set-password',
				name: 'set-password',
				component: () => import('@/components/SetPassword.vue'),
				meta: {
					title: 'Set Password - E-Learning',
					authRequired: false,
					hideWhenAuthenticated: true,
					allowedRoles: ['admin', 'instructor', 'student'],
				},
			},
			{
				path: '/change-password',
				name: 'change-password',
				component: () => import('@/components/ChangePassword.vue'),
				meta: {
					title: 'Change Password - E-Learning',
					authRequired: true,
					hideWhenAuthenticated: false,
					allowedRoles: ['admin', 'instructor', 'student'],
				},
			},
		],
	},
];
