import config from 'config';
import jwt, { SignOptions } from 'jsonwebtoken';

const PUBLIC_KEY = config.get<string>('publicKey');
const PRIVATE_KEY = config.get<string>('privateKey');

function signJWT(object: object, options?: SignOptions | undefined) {
	return jwt.sign(object, PRIVATE_KEY, {
		// eslint-disable-next-line sonarjs/no-identical-expressions
		...(options && options),
		algorithm: 'RS256'
	});
}

function verifyJWT(token: string) {
	try {
		const decoded = jwt.verify(token, PUBLIC_KEY);

		return {
			valid: true,
			expired: false,
			decoded
		};
	} catch (_error: unknown) {
		const error = _error as Error;
		return {
			valid: false,
			expired: error.message === 'jwt expired',
			decoded: undefined
		};
	}
}

export { signJWT, verifyJWT };
