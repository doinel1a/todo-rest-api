import { Express, Request, Response } from 'express';

import secondsToHMS from '../utils/seconds-to-hms';

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
}

export default routes;
