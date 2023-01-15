import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';

import log from '../../utils/logger';

function validateResource(schema: AnyZodObject) {
	return function (request: Request, response: Response, next: NextFunction) {
		try {
			schema.parse({
				body: request.body,
				query: request.query,
				params: request.params
			});

			next();
		} catch (_error: unknown) {
			const error = _error as ZodError;

			log.error('!!! VALIDATE USER ERROR !!!');
			log.error(`ERROR MESSAGE: ${error}`);

			return response
				.status(400)
				.send({ error: error.errors[0].message });
		}
	};
}

export default validateResource;
