import config from 'config';
import cors from 'cors';
import express, { json } from 'express';
import helmet from 'helmet';

import routes from './api/routes';
import connect from './utils/connect';

const HOST = config.get<string>('host');
const PORT = config.get<number>('port');

const server = express();

server.use(helmet());
server.use(cors());
server.use(json());

server.listen(PORT, async () => {
	console.log(`SERVER RUNNING AT http://${HOST}:${PORT}`);

	await connect();

	routes(server);
});
