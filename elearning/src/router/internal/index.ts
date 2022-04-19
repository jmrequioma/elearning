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
			{
				path: '/edit-subject/:id',
				name: 'edit-subject',
				component: () => import('@/pages/subject/SubjectDetailsPage.vue'),
				meta: {
					title: 'Edit Subject - E-Learning',
					authRequired: true,
					hideWhenAuthenticated: false,
				},
				props: true,
			},
			{
				path: '/edit-subject/:subjectId/add-course',
				name: 'add-subject-course',
				component: () => import('@/pages/subject/SubjectCoursesPage.vue'),
				meta: {
					title: 'Add Course (Subject) - E-Learning',
					authRequired: true,
					hideWhenAuthenticated: false,
				},
				props: true,
			},
		],
	},
];
