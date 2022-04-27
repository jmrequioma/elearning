import { rest } from 'msw';
import { API_URL } from '@/constants';
import { DELAY, DEFAULT_LIMIT, DEFAULT_PAGE } from '@/mocks/constants';
import { db } from '@/mocks/db';
import { validateAuth, extractAccessToken, checkAuth } from '../utils';

export const enrollmentHandlers = [
	// get enrollments
	rest.get(`${API_URL}/enrollments`, (req, res, ctx) => {
		const auth = validateAuth(req);
		if (auth.errorMessage) {
			return res(ctx.delay(DELAY), ctx.status(401), ctx.json(auth));
		}
		const limit = Number(req.url.searchParams.get('limit')) || DEFAULT_LIMIT;
		const page = Number(req.url.searchParams.get('page')) || DEFAULT_PAGE;
		const keyword = req.url.searchParams.get('keyword') || '';
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

		let enrollments = [];
		if (full) {
			enrollments = db.enrollment.findMany({
				where: query,
				orderBy: {
					createdAt: 'desc',
				},
			});
		} else {
			enrollments = db.enrollment.findMany({
				take: limit,
				skip,
				where: query,
				orderBy: {
					createdAt: 'desc',
				},
			});
		}

		const totalCount = db.enrollment.count({ where: query });

		const data = enrollments.map((enrollment) => {
			const user = db.user.findFirst({
				where: { id: { equals: enrollment.course?.authorId } },
			});
			const subject = db.subject.findFirst({
				where: { id: { equals: enrollment.course?.subjectId } },
			});
			const course = {
				...enrollment.course,
				author: `${user?.firstName} ${user?.lastName}`,
				subject,
			};
			return {
				...enrollment,
				course,
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

	// add enrollment
	rest.post(`${API_URL}/enrollments`, (req, res, ctx) => {
		const auth = validateAuth(req);
		const accessToken = extractAccessToken(req) as string;
		const loggedInUser = checkAuth(accessToken);

		if (auth.errorMessage) {
			return res(ctx.delay(DELAY), ctx.status(401), ctx.json(auth));
		}
		const { courseId } = req.body as { courseId: number };

		const course = db.course.findFirst({
			where: { id: { equals: courseId } },
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

		const lastId = db.enrollment.count();

		const date = new Date().toISOString();

		const enrollment = db.enrollment.create({
			id: lastId + 1,
			isStarted: false,
			createdAt: date,
			updatedAt: date,
			userId: loggedInUser?.id,
			course,
		});
		return res(ctx.delay(DELAY), ctx.json(enrollment));
	}),

	// get enrollment
	rest.get(`${API_URL}/enrollments/:id`, (req, res, ctx) => {
		const auth = validateAuth(req);
		if (auth.errorMessage) {
			return res(ctx.delay(DELAY), ctx.status(401), ctx.json(auth));
		}

		const id = Number(req.params.id);

		const enrollment = db.enrollment.findFirst({
			where: { id: { equals: id } },
		});

		if (!enrollment) {
			return res(
				ctx.delay(DELAY),
				ctx.status(404),
				ctx.json({
					message: 'Enrollment not found.',
				})
			);
		}

		return res(ctx.delay(DELAY), ctx.json(enrollment));
	}),
];
