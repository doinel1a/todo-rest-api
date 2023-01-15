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

async function validatePassword({
	email,
	password
}: {
	email: string;
	password: string;
}) {
	const user = await UserModel.findOne({ email });

	if (!user) return false;

	const isPasswordValid = await user.comparePassword(password);

	if (!isPasswordValid) return false;

	return omit(user.toJSON(), 'password');
}

export default createUser;
export { validatePassword };
