import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import supertest from 'supertest';

import initServer from '../../server';

const server = initServer();

beforeAll(async () => {
	const mongo = await MongoMemoryServer.create();

	mongoose.set('strictQuery', true);

	await mongoose.connect(mongo.getUri());
});

afterAll(async () => {
	await mongoose.disconnect();
	await mongoose.connection.close();
});

describe('POST /api/session -- create user session', () => {
	const POST_USERS_ENDPOINT = '/api/users';
	const POST_SESSIONS_ENDPOINT = '/api/sessions';

	const userInputBody = {
		email: 'doinel@gmail.com',
		name: 'Doinel',
		password: 'Dodo1234!!',
		passwordConfirmation: 'Dodo1234!!'
	};

	describe("given user's e-mail and password", () => {
		describe('correct INFOS', () => {
			describe('simple', () => {
				const inputBody = {
					email: userInputBody.email,
					password: userInputBody.password
				};

				it('should successfully create a user session and return a 201 with access token & refresh token', async () => {
					await supertest(server)
						.post(POST_USERS_ENDPOINT)
						.send(userInputBody);

					const { statusCode, body } = await supertest(server)
						.post(POST_SESSIONS_ENDPOINT)
						.send(inputBody);

					expect(statusCode).toBe(201);
				});
			});
		});
	});
});
