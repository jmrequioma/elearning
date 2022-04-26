import { rest } from 'msw';
import { API_URL } from '@/constants';
import { DELAY, DEFAULT_LIMIT, DEFAULT_PAGE } from '@/mocks/constants';
import { db } from '@/mocks/db';
import { checkAuth, validateAuth, extractAccessToken } from '../utils';
import faker from '@faker-js/faker';

export const courseHandlers = [
	// get courses
	rest.get(`${API_URL}/courses`, (req, res, ctx) => {
		const auth = validateAuth(req);
		if (auth.errorMessage) {
			return res(ctx.delay(DELAY), ctx.status(401), ctx.json(auth));
		}
		const limit = Number(req.url.searchParams.get('limit')) || DEFAULT_LIMIT;
		const page = Number(req.url.searchParams.get('page')) || DEFAULT_PAGE;
		const keyword = req.url.searchParams.get('keyword') || '';
		const published = req.url.searchParams.get('published') || '';
		const subjectId = req.url.searchParams.get('subjectId') || '';
		const authorId = req.url.searchParams.get('authorId') || '';
		const full = req.url.searchParams.get('full') || false;

		const skip = (page - 1) * limit;

		let query = {};

		if (keyword) {
			query = {
				...query,
				title: {
					contains: keyword,
				},
			};
		}

		if (published) {
			query = {
				...query,
				isPublished: {
					equals: published === 'true',
				},
			};
		}

		if (full) {
			const courses = db.course.findMany({
				where: query,
				orderBy: {
					title: 'asc',
				},
			});

			const data = courses.map((course) => {
				const subject = db.subject.findFirst({
					where: { id: { equals: course.subjectId } },
				});
				const author = db.user.findFirst({
					where: { id: { equals: course.authorId } },
				});

				return {
					...course,
					subject,
					author: `${author?.firstName} ${author?.lastName}`,
				};
			});
			return res(ctx.delay(DELAY), ctx.json(data));
		}

		if (subjectId) {
			query = {
				...query,
				subjectId: {
					equals: Number(subjectId),
				},
			};
		}

		if (authorId) {
			query = {
				...query,
				authorId: {
					equals: Number(authorId),
				},
			};
		}

		const courses = db.course.findMany({
			take: limit,
			skip,
			where: query,
			orderBy: {
				title: 'asc',
			},
		});

		const totalCount = db.course.count({ where: query });

		const data = courses.map((course) => {
			const subject = db.subject.findFirst({
				where: { id: { equals: course.subjectId } },
			});
			const author = db.user.findFirst({
				where: { id: { equals: course.authorId } },
			});

			return {
				...course,
				subject,
				author: `${author?.firstName} ${author?.lastName}`,
			};
		});

		const response = {
			data,
			page,
			limit,
			totalCount,
		};

		return res(ctx.delay(DELAY), ctx.json(response));
	}),

	// update course
	rest.patch(`${API_URL}/courses/:id`, (req, res, ctx) => {
		const auth = validateAuth(req);
		if (auth.errorMessage) {
			return res(ctx.delay(DELAY), ctx.status(401), ctx.json(auth));
		}
		const data = req.body as Record<string, string>;
		const id = Number(req.params.id);

		const date = new Date().toISOString();
		const newCourse = db.course.update({
			where: { id: { equals: id } },
			data: {
				...data,
				updatedAt: date,
			},
		});

		if (!newCourse) {
			return res(
				ctx.delay(DELAY),
				ctx.status(404),
				ctx.json({
					message: 'Course not found.',
				})
			);
		}

		return res(ctx.delay(DELAY), ctx.json(newCourse));
	}),

	// delete course
	rest.delete(`${API_URL}/courses/:id`, (req, res, ctx) => {
		const auth = validateAuth(req);
		if (auth.errorMessage) {
			return res(ctx.delay(DELAY), ctx.status(401), ctx.json(auth));
		}
		const id = Number(req.params.id);

		const deletedCourse = db.course.delete({
			where: { id: { equals: id } },
		});

		if (!deletedCourse) {
			return res(
				ctx.delay(DELAY),
				ctx.status(404),
				ctx.json({
					message: 'Course not found.',
				})
			);
		}

		return res(ctx.delay(DELAY), ctx.status(200));
	}),

	// add course
	rest.post(`${API_URL}/courses`, (req, res, ctx) => {
		const auth = validateAuth(req);
		const accessToken = extractAccessToken(req) as string;
		const loggedInUser = checkAuth(accessToken);
		if (auth.errorMessage) {
			return res(ctx.delay(DELAY), ctx.status(401), ctx.json(auth));
		}
		const data = req.body as {
			subjectId: number;
			title: string;
			isPublished: boolean;
			description: string;
		};

		const existingCourse = db.course.findFirst({
			where: {
				title: {
					equals: data.title,
				},
			},
		});

		if (existingCourse) {
			return res(
				ctx.delay(DELAY),
				ctx.status(409),
				ctx.json({
					message: 'Title must be unique.',
				})
			);
		}

		const lastId = db.course.count();

		const date = new Date().toISOString();
		const course = db.course.create({
			id: lastId + 1,
			title: data.title,
			description: data.description,
			duration: faker.datatype.number({ min: 1, max: 100 }),
			icon: faker.image.imageUrl(),
			isPublished: false,
			createdAt: date,
			updatedAt: date,
			subjectId: Number(data.subjectId),
			authorId: loggedInUser?.id,
			modules: [],
		});

		return res(ctx.delay(DELAY), ctx.json(course));
	}),

	// get course details
	rest.get(`${API_URL}/courses/:id`, (req, res, ctx) => {
		const auth = validateAuth(req);

		if (auth.errorMessage) {
			return res(ctx.delay(DELAY), ctx.status(401), ctx.json(auth));
		}
		const id = Number(req.params.id);

		const course = db.course.findFirst({
			where: { id: { equals: id } },
		});

		if (!course) {
			return res(
				ctx.delay(DELAY),
				ctx.status(404),
				ctx.json({
					message: 'Course not found.',
				})
			);
		}

		const subject = db.subject.findFirst({
			where: { id: { equals: course.subjectId } },
		});

		const data = { ...course, subject };

		return res(ctx.delay(DELAY), ctx.json(data));
	}),
];
