export default [
	{
		path: '/',
		component: () => import('@/pages/HomePage.vue'),
		children: [
			{
				path: '',
				name: 'login',
				component: () => import('@/components/Login.vue'),
				meta: {
					title: 'Login - E-Learning',
					authRequired: false,
					hideWhenAuthenticated: true,
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
				},
			},
		],
	},
];
