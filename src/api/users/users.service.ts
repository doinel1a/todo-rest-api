import { omit } from 'lodash';

import UserModel, { UserInput } from './user.model';

async function createUser(input: UserInput) {
	try {
		const user = await UserModel.create(input);
		return omit(user.toJSON(), 'password');
	} catch (_error: unknown) {
		const error = _error as Error;

		throw new Error(error.message);
	}
}

export default createUser;
