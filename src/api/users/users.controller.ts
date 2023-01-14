import { Request, Response } from 'express';

import log from '../../utils/logger';
import createUser from './users.service';

async function createUserController(request: Request, response: Response) {
	try {
		const user = await createUser(request.body);

		return response.status(201).send(user);
	} catch (_error: unknown) {
		const error = _error as Error;

		log.error('!!! CREATING USER ERROR !!!');
		log.error(`ERROR MESSAGE: ${error.message}`);

		return response.status(409).send(error.message);
	}
}

export default createUserController;
