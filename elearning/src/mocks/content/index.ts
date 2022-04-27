import { rest } from 'msw';
import { API_URL } from '@/constants';
import { DELAY } from '@/mocks/constants';
import { db } from '@/mocks/db';
import { validateAuth, extractAccessToken, checkAuth } from '../utils';

export const contentHandlers = [
	// create content
	rest.post(`${API_URL}/contents`, (req, res, ctx) => {
		const auth = validateAuth(req);
		const accessToken = extractAccessToken(req) as string;
		const loggedInUser = checkAuth(accessToken);

		if (auth.errorMessage) {
			return res(ctx.delay(DELAY), ctx.status(401), ctx.json(auth));
		}

		const data = req.body as {
			moduleId: number;
			content: string;
		};

		const date = new Date().toISOString();

		const lastId = db.content.count();
		const newContent = db.content.create({
			id: lastId + 1,
			content: data.content,
			type: 'delta',
			isPublished: true,
			createdAt: date,
			updatedAt: date,
			authorId: loggedInUser?.id,
			moduleId: data.moduleId,
		});

		// update parent module
		db.module.update({
			where: { id: { equals: newContent.moduleId } },
			data: { contents: [newContent], updatedAt: date },
		});

		return res(ctx.delay(DELAY), ctx.json(newContent));
	}),

	// update content
	rest.patch(`${API_URL}/contents/:id`, (req, res, ctx) => {
		const auth = validateAuth(req);
		if (auth.errorMessage) {
			return res(ctx.delay(DELAY), ctx.status(401), ctx.json(auth));
		}

		const data = req.body as Record<string, string>;
		const id = Number(req.params.id);

		const date = new Date().toISOString();

		const content = db.content.update({
			where: { id: { equals: id } },
			data: { content: data.content, updatedAt: date },
		});

		if (!content) {
			return res(
				ctx.delay(DELAY),
				ctx.status(500),
				ctx.json({ message: 'Unable to update content.' })
			);
		}

		// update parent module
		db.module.update({
			where: { id: { equals: content.moduleId } },
			data: { contents: [content] },
		});

		return res(ctx.delay(DELAY), ctx.json(content));
	}),
];
