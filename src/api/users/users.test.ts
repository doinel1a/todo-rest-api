import mongoose, { Types } from 'mongoose';
import supertest from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';

import initServer from '../../server';

const server = initServer();

beforeAll(async () => {
	const mongo = await MongoMemoryServer.create();

	await mongoose.connect(mongo.getUri());
});

afterAll(async () => {
	await mongoose.disconnect();
	await mongoose.connection.close();
});

describe('user', () => {
	describe('register user', () => {
		const POST_USERS_ENDPOINT = '/api/users';

		const inputBody = {
			email: 'dodo123456@gmail.com',
			name: 'Dodo',
			password: 'dodonel1',
			passwordConfirmation: 'dodonel1'
		};
		describe('given a user details', () => {
			it("should successfully register a user and return a 201 with a JSON with user's details", async () => {
				const { statusCode, body } = await supertest(server)
					.post(POST_USERS_ENDPOINT)
					.send(inputBody);

				expect(statusCode).toBe(201);
			});
		});
		describe('given an already registered email', () => {
			it('should return an 409 with an error', async () => {
				const errorPayload = `E11000 duplicate key error collection: test.users index: email_1 dup key: { email: "${inputBody.email}" }`;

				const { statusCode, body } = await supertest(server)
					.post(POST_USERS_ENDPOINT)
					.send(inputBody);

				expect(statusCode).toBe(409);
				expect(body.error).toEqual(errorPayload);
			});
		});
	});
});
