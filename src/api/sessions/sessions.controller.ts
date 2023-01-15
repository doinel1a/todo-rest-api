import config from 'config';
import { Request, Response } from 'express';

import { signJWT } from '../../utils/jwt';
import { validatePassword } from '../users/users.service';
import createSession from './sessions.service';

async function createSessionController(request: Request, response: Response) {
	const user = await validatePassword(request.body);

	if (!user)
		return response
			.status(401)
			.send({ error: 'Invalid email or password!' });

	const session = await createSession(
		user._id,
		request.get('user-agent') || ''
	);

	const accessToken = signJWT(
		{ ...user, session: session._id },
		{
			expiresIn: config.get<number>('accessTokenTTL')
		}
	);

	const refreshToken = signJWT(
		{ ...user, session: session._id },
		{
			expiresIn: config.get<number>('refreshTokenTTL')
		}
	);

	return response.status(201).send({ accessToken, refreshToken });
}

export default createSessionController;
