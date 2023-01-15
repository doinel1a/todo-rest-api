import SessionModel from './session.model';

async function createSession(userId: string, userAgent: string) {
	try {
		const session = await SessionModel.create({ user: userId, userAgent });

		return session.toJSON();
	} catch (_error: unknown) {
		const error = _error as Error;

		throw new Error(error.message);
	}
}

export default createSession;
