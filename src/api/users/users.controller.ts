import { Request, Response } from 'express';
import { MongooseError } from 'mongoose';

import log from '../../utils/logger';
import { CreateUserInput } from './user.schema';
import createUser from './users.service';

async function createUserController(
	request: Request<
		Record<string, never>,
		Record<string, never>,
		CreateUserInput['body']
	>,
	response: Response
) {
	try {
		const user = await createUser(request.body);

		return response.status(201).send(user);
	} catch (_error: unknown) {
		const error = _error as MongooseError;

		log.error('!!! CREATING USER ERROR !!!');
		log.error(`ERROR MESSAGE: ${error.message}`);

		return response.status(409).send({ error: `${error.message}` });
	}
}

export default createUserController;
