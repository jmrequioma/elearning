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
				name: 'edit-subject-add-course',
				component: () => import('@/pages/subject/SubjectCoursesPage.vue'),
				meta: {
					title: 'Edit Subject -> Add Course - E-Learning',
					authRequired: true,
					hideWhenAuthenticated: false,
				},
				props: true,
			},
			{
				path: '/edit-subject/:subjectId/edit-course/:courseId',
				name: 'edit-subject-edit-course',
				component: () => import('@/pages/subject/SubjectCoursesPage.vue'),
				meta: {
					title: 'Edit Subject -> Edit Course - E-Learning',
					authRequired: true,
					hideWhenAuthenticated: false,
				},
				props: true,
			},
			{
				path: '/edit-subject/:subjectId/edit-course/:courseId/add-module',
				name: 'edit-subject-add-module',
				component: () => import('@/pages/subject/SubjectModulesPage.vue'),
				meta: {
					title: 'Edit Subject -> Add Module - E-Learning',
					authRequired: true,
					hideWhenAuthenticated: false,
				},
				props: true,
			},
			{
				path: '/edit-subject/:subjectId/edit-course/:courseId/edit-module/:moduleId',
				name: 'edit-subject-edit-module',
				component: () => import('@/pages/subject/SubjectModulesPage.vue'),
				meta: {
					title: 'Edit Subject -> Edit Module - E-Learning',
					authRequired: true,
					hideWhenAuthenticated: false,
				},
				props: true,
			},
		],
	},
	{
		path: '/courses',
		component: () => import('@/pages/HomePage.vue'),
		children: [
			{
				path: '',
				name: 'courses',
				component: () => import('@/pages/course/CoursePage.vue'),
				meta: {
					title: 'Courses - E-Learning',
					authRequired: true,
					hideWhenAuthenticated: false,
				},
			},
		],
	},
];
