import config from 'config';

import initServer from './server';
import connect from './utils/connect';

const HOST = config.get<string>('host');
const PORT = config.get<number>('port');

const server = initServer();

server.listen(PORT, async () => {
	console.log(`SERVER RUNNING AT http://${HOST}:${PORT}`);

	await connect();
});
