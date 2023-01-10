import config from 'config';
import mongoose, { Error } from 'mongoose';

import log from './logger';

mongoose.set('strictQuery', true);

async function connect() {
	const DB_URI = config.get<string>('dbURI');

	try {
		await mongoose.connect(DB_URI);

		log.info('DATABASE CONNECTED');
	} catch (_error: unknown) {
		const error = _error as Error;

		log.error('!!! DATABASE CONNECTION ERROR !!!');
		log.error(`ERROR NAME: ${error.name}`);
		log.error(`ERROR MESSAGE: ${error.message}`);
	}
}

export default connect;
