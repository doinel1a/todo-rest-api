import { Express, Request, Response } from 'express';

import secondsToHMS from '../utils/seconds-to-hms';
import validateResource from './middleware/validate-resource';
import createSessionSchema from './sessions/session.schema';
import createSessionController from './sessions/sessions.controller';
import createUserSchema from './users/user.schema';
import createUserController from './users/users.controller';

function routes(server: Express) {
	server.get('/api/healthcheck', (request: Request, response: Response) => {
		const healthCheck = {
			message: 'OK',
			uptime: `${secondsToHMS(process.uptime())}`,
			timestamp: new Date().toLocaleString()
		};

		try {
			response.status(200).send(healthCheck);
		} catch (_error: unknown) {
			const error = _error as Error;

			healthCheck.message = error.message;

			response.status(500).send(healthCheck);
		}
	});

	server.post(
		'/api/users',
		validateResource(createUserSchema),
		createUserController
	);

	server.post(
		'/api/sessions',
		validateResource(createSessionSchema),
		createSessionController
	);
}

export default routes;
