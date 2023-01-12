import cors from 'cors';
import express, { json } from 'express';
import helmet from 'helmet';

import routes from './api/routes';

function initServer() {
	const server = express();

	server.use(helmet());
	server.use(cors());
	server.use(json());

	routes(server);

	return server;
}

export default initServer;
