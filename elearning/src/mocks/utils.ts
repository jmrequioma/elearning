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
