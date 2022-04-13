export default [
	{
		path: '/subjects',
		component: () => import('@/pages/HomePage.vue'),
		children: [
			{
				path: '',
				name: 'subjects',
				component: () => import('@/pages/subject/SubjectPage.vue'),
				meta: {
					title: 'Subjects - E-Learning',
					authRequired: true,
					hideWhenAuthenticated: false,
				},
			},
			{
				path: '/add-subject',
				name: 'add-subject',
				component: () => import('@/pages/subject/SubjectDetailsPage.vue'),
				meta: {
					title: 'Add Subject - E-Learning',
					authRequired: true,
					hideWhenAuthenticated: false,
				},
			},
		],
	},
];
