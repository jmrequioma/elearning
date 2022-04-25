import { db } from './db';
import type { RestRequest } from 'msw';

export function extractAccessToken(request: RestRequest) {
	const bearerToken = request.headers.get('authorization');
	return bearerToken ? bearerToken.split(' ')[1] : null;
}

// basic checking of accessToken (should be done in backend)
export function checkAuth(accessToken: string) {
	const foundUser = db.user.findFirst({
		where: {
			accessToken: {
				equals: accessToken,
			},
		},
	});
	return foundUser;
}

export function validateAuth(request: RestRequest) {
	const accessToken = extractAccessToken(request);

	if (!accessToken) {
		return { errorMessage: 'No token provided.' };
	}

	const user = checkAuth(accessToken);

	if (!user) {
		return { errorMessage: 'Unauthorized user.' };
	}

	return {};
}
