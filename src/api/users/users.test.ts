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

describe('POST /api/users -- user registration', () => {
	const POST_USERS_ENDPOINT = '/api/users';
	let emailIndex = 1;

	describe("given user's details with", () => {
		describe('correct INFOS', () => {
			describe('simple', () => {
				const inputBody = {
					email: 'doinel@gmail.com',
					name: 'Doinel',
					password: 'Dodo1234!!',
					passwordConfirmation: 'Dodo1234!!'
				};

				it("should successfully register a user and return a 201 with user's payload", async () => {
					const { statusCode, body } = await supertest(server)
						.post(POST_USERS_ENDPOINT)
						.send(inputBody);

					expect(statusCode).toBe(201);
				});
			});

			describe('special alphabet character', () => {
				const inputBody = {
					email: 'doinel@gmail.com',
					name: 'Dòinel',
					password: 'Dodo1234!!',
					passwordConfirmation: 'Dodo1234!!'
				};

				it("should successfully register a user and return a 201 with user's payload", async () => {
					const { statusCode, body } = await supertest(server)
						.post(POST_USERS_ENDPOINT)
						.send(inputBody);

					expect(statusCode).toBe(201);
				});
			});
		});

		describe('faulty EMAIL', () => {
			describe('duplicate', () => {
				const inputBody = {
					email: 'doinel@gmail.com',
					name: 'Doinel',
					password: 'Dodo1234!!',
					passwordConfirmation: 'Dodo1234!!'
				};

				const errorPayload = `E11000 duplicate key error collection: test.users index: email_1 dup key: { email: "${inputBody.email}" }`;

				it('should return an 409 with an error payload', async () => {
					const { statusCode, body } = await supertest(server)
						.post(POST_USERS_ENDPOINT)
						.send(inputBody);

					expect(statusCode).toBe(409);
					expect(body.error).toEqual(errorPayload);
				});
			});

			describe('empty', () => {
				const inputBody = {
					email: '',
					name: 'Doinel',
					password: 'Dodo1234!!',
					passwordConfirmation: 'Dodo1234!!'
				};

				const errorPayload = 'E-mail is required!';

				it('should return a 400 with an error payload', async () => {
					const { statusCode, body } = await supertest(server)
						.post(POST_USERS_ENDPOINT)
						.send(inputBody);

					expect(statusCode).toBe(400);
					expect(body.error).toEqual(errorPayload);
				});
			});

			describe('filled with spaces', () => {
				const inputBody = {
					email: '    ',
					name: 'Doinel',
					password: 'Dodo1234!!',
					passwordConfirmation: 'Dodo1234!!'
				};

				const errorPayload = 'E-mail must be valid!';

				it('should return a 400 with an error payload', async () => {
					const { statusCode, body } = await supertest(server)
						.post(POST_USERS_ENDPOINT)
						.send(inputBody);

					expect(statusCode).toBe(400);
					expect(body.error).toEqual(errorPayload);
				});
			});

			describe('missing @', () => {
				const inputBody = {
					email: `doinel${emailIndex++}gmail.com`,
					name: 'Doinel',
					password: 'Dodo1234!!',
					passwordConfirmation: 'Dodo1234!!'
				};

				const errorPayload = 'E-mail must be valid!';

				it('should return a 400 with an error payload', async () => {
					const { statusCode, body } = await supertest(server)
						.post(POST_USERS_ENDPOINT)
						.send(inputBody);

					expect(statusCode).toBe(400);
					expect(body.error).toEqual(errorPayload);
				});
			});

			describe('missing .TLD', () => {
				const inputBody = {
					email: `doinel${emailIndex++}@gmail.`,
					name: 'Doinel',
					password: 'Dodo1234!!',
					passwordConfirmation: 'Dodo1234!!'
				};

				const errorPayload = 'E-mail must be valid!';

				it('should return a 400 with an error payload', async () => {
					const { statusCode, body } = await supertest(server)
						.post(POST_USERS_ENDPOINT)
						.send(inputBody);

					expect(statusCode).toBe(400);
					expect(body.error).toEqual(errorPayload);
				});
			});

			describe('special alphabet character', () => {
				const inputBody = {
					email: `dòinel${emailIndex++}@gmail.com`,
					name: 'Doinel',
					password: 'Dodo1234!!',
					passwordConfirmation: 'Dodo1234!!'
				};

				const errorPayload = 'E-mail must be valid!';

				it('should return a 400 with an error payload', async () => {
					const { statusCode, body } = await supertest(server)
						.post(POST_USERS_ENDPOINT)
						.send(inputBody);

					expect(statusCode).toBe(400);
					expect(body.error).toEqual(errorPayload);
				});
			});

			describe('non-latin characters', () => {
				const inputBody = {
					email: `doinel🙂${emailIndex++}@gmail.com`,
					name: 'Doinel',
					password: 'Dodo1234!!',
					passwordConfirmation: 'Dodo1234!!'
				};

				const errorPayload = 'E-mail must be valid!';

				it('should return a 400 with an error payload', async () => {
					const { statusCode, body } = await supertest(server)
						.post(POST_USERS_ENDPOINT)
						.send(inputBody);

					expect(statusCode).toBe(400);
					expect(body.error).toEqual(errorPayload);
				});
			});

			describe('special character other than .', () => {
				const inputBody = {
					email: `doinel-${emailIndex++}@gmail.com`,
					name: 'Doinel',
					password: 'Dodo1234!!',
					passwordConfirmation: 'Dodo1234!!'
				};

				const errorPayload = 'E-mail must be valid!';

				it('should return a 400 with an error payload', async () => {
					const { statusCode, body } = await supertest(server)
						.post(POST_USERS_ENDPOINT)
						.send(inputBody);

					expect(statusCode).toBe(400);
					expect(body.error).toEqual(errorPayload);
				});
			});

			describe('numbers', () => {
				const inputBody = {
					email: '123@gmail.com',
					name: 'Doinel',
					password: 'Dodo1234!!',
					passwordConfirmation: 'Dodo1234!!'
				};

				const errorPayload = 'E-mail must be valid!';

				it('should return a 400 with an error payload', async () => {
					const { statusCode, body } = await supertest(server)
						.post(POST_USERS_ENDPOINT)
						.send(inputBody);

					expect(statusCode).toBe(400);
					expect(body.error).toEqual(errorPayload);
				});
			});

			describe('longer than 30', () => {
				const inputBody = {
					email: `'doineldoineldoineldo${emailIndex++}@gmail.com`,
					name: 'Doinel',
					password: 'Dodo1234!!',
					passwordConfirmation: 'Dodo1234!!'
				};

				const errorPayload =
					'E-mail must be at most 30 charactes long!';

				it('should return a 400 with an error payload', async () => {
					const { statusCode, body } = await supertest(server)
						.post(POST_USERS_ENDPOINT)
						.send(inputBody);

					expect(statusCode).toBe(400);
					expect(body.error).toEqual(errorPayload);
				});
			});
		});

		describe('faulty NAME', () => {
			describe('empty', () => {
				const inputBody = {
					email: `doinel${emailIndex++}@gmail.com`,
					name: '',
					password: 'Dodo1234!!',
					passwordConfirmation: 'Dodo1234!!'
				};

				const errorPayload = 'Name is required!';

				it('should return a 400 with an error payload', async () => {
					const { statusCode, body } = await supertest(server)
						.post(POST_USERS_ENDPOINT)
						.send(inputBody);

					expect(statusCode).toBe(400);
					expect(body.error).toEqual(errorPayload);
				});
			});

			describe('filled with spaces', () => {
				const inputBody = {
					email: `doinel${emailIndex++}@gmail.com`,
					name: '    ',
					password: 'Dodo1234!!',
					passwordConfirmation: 'Dodo1234!!'
				};

				const errorPayload = 'Name must include only latin characters!';

				it('should return a 400 with an error payload', async () => {
					const { statusCode, body } = await supertest(server)
						.post(POST_USERS_ENDPOINT)
						.send(inputBody);

					expect(statusCode).toBe(400);
					expect(body.error).toEqual(errorPayload);
				});
			});

			describe('non-latin characters', () => {
				const inputBody = {
					email: `doinel${emailIndex++}@gmail.com`,
					name: 'Doinel🙂',
					password: 'Dodo1234!!',
					passwordConfirmation: 'Dodo1234!!'
				};

				const errorPayload = 'Name must include only latin characters!';

				it('should return a 400 with an error payload', async () => {
					const { statusCode, body } = await supertest(server)
						.post(POST_USERS_ENDPOINT)
						.send(inputBody);

					expect(statusCode).toBe(400);
					expect(body.error).toEqual(errorPayload);
				});
			});

			describe('numbers', () => {
				const inputBody = {
					email: `doinel${emailIndex++}@gmail.com`,
					name: 'Doinel1',
					password: 'Dodo1234!!',
					passwordConfirmation: 'Dodo1234!!'
				};

				const errorPayload = 'Name must include only latin characters!';

				it('should return a 400 with an error payload', async () => {
					const { statusCode, body } = await supertest(server)
						.post(POST_USERS_ENDPOINT)
						.send(inputBody);

					expect(statusCode).toBe(400);
					expect(body.error).toEqual(errorPayload);
				});
			});

			describe('special charecters', () => {
				const inputBody = {
					email: `doinel${emailIndex++}@gmail.com`,
					name: 'Doinel!',
					password: 'Dodo1234!!',
					passwordConfirmation: 'Dodo1234!!'
				};

				const errorPayload = 'Name must include only latin characters!';

				it('should return a 400 with an error payload', async () => {
					const { statusCode, body } = await supertest(server)
						.post(POST_USERS_ENDPOINT)
						.send(inputBody);

					expect(statusCode).toBe(400);
					expect(body.error).toEqual(errorPayload);
				});
			});

			describe('numbers & special charecters', () => {
				const inputBody = {
					email: `doinel${emailIndex++}@gmail.com`,
					name: './Doinel1!',
					password: 'Dodo1234!!',
					passwordConfirmation: 'Dodo1234!!'
				};

				const errorPayload = 'Name must include only latin characters!';

				it('should return a 400 with an error payload', async () => {
					const { statusCode, body } = await supertest(server)
						.post(POST_USERS_ENDPOINT)
						.send(inputBody);

					expect(statusCode).toBe(400);
					expect(body.error).toEqual(errorPayload);
				});
			});

			describe('longer than 30', () => {
				const inputBody = {
					email: `doinel${emailIndex++}@gmail.com`,
					name: 'DoinelDoinelDoinelDoinelDoinelD',
					password: 'Dodo1234!!',
					passwordConfirmation: 'Dodo1234!!'
				};

				const errorPayload = 'Name must be at most 30 charactes long!';

				it('should return a 400 with an error payload', async () => {
					const { statusCode, body } = await supertest(server)
						.post(POST_USERS_ENDPOINT)
						.send(inputBody);

					expect(statusCode).toBe(400);
					expect(body.error).toEqual(errorPayload);
				});
			});
		});

		describe('faulty PASSWORD', () => {
			describe('empty', () => {
				const inputBody = {
					email: `doinel${emailIndex++}@gmail.com`,
					name: 'Doinel',
					password: '',
					passwordConfirmation: ''
				};

				const errorPayload = 'Password must be at least 8 characters!';

				it('should return a 400 with an error payload', async () => {
					const { statusCode, body } = await supertest(server)
						.post(POST_USERS_ENDPOINT)
						.send(inputBody);

					expect(statusCode).toBe(400);
					expect(body.error).toEqual(errorPayload);
				});
			});

			describe('shorter than 8', () => {
				const inputBody = {
					email: `doinel${emailIndex++}@gmail.com`,
					name: 'Doinel',
					password: 'Dodo12!',
					passwordConfirmation: 'Dodo12!'
				};

				const errorPayload = 'Password must be at least 8 characters!';

				it('should return a 400 with an error payload', async () => {
					const { statusCode, body } = await supertest(server)
						.post(POST_USERS_ENDPOINT)
						.send(inputBody);

					expect(statusCode).toBe(400);
					expect(body.error).toEqual(errorPayload);
				});
			});

			describe('filled with 8 spaces', () => {
				const inputBody = {
					email: `doinel${emailIndex++}@gmail.com`,
					name: 'Doinel',
					password: '        ',
					passwordConfirmation: '        '
				};

				const errorPayload =
					'Password must contain at least one uppercase letter!';

				it('should return a 400 with an error payload', async () => {
					const { statusCode, body } = await supertest(server)
						.post(POST_USERS_ENDPOINT)
						.send(inputBody);

					expect(statusCode).toBe(400);
					expect(body.error).toEqual(errorPayload);
				});
			});

			describe('longer than 40', () => {
				const inputBody = {
					email: `doinel${emailIndex++}@gmail.com`,
					name: 'Doinel',
					password: 'Dodododododododododododododododododo123!!',
					passwordConfirmation:
						'Dodododododododododododododododododo123!!'
				};

				const errorPayload =
					'Password must be at most 40 charactes long!';

				it('should return a 400 with an error payload', async () => {
					const { statusCode, body } = await supertest(server)
						.post(POST_USERS_ENDPOINT)
						.send(inputBody);

					expect(statusCode).toBe(400);
					expect(body.error).toEqual(errorPayload);
				});
			});

			describe("doesn't contain at least one uppercase letter", () => {
				const inputBody = {
					email: `doinel${emailIndex++}@gmail.com`,
					name: 'Doinel',
					password: 'dodo1234!',
					passwordConfirmation: 'dodo1234!'
				};

				const errorPayload =
					'Password must contain at least one uppercase letter!';

				it('should return a 400 with an error payload', async () => {
					const { statusCode, body } = await supertest(server)
						.post(POST_USERS_ENDPOINT)
						.send(inputBody);

					expect(statusCode).toBe(400);
					expect(body.error).toEqual(errorPayload);
				});
			});

			describe("doesn't contain at least one lowercase letter", () => {
				const inputBody = {
					email: `doinel${emailIndex++}@gmail.com`,
					name: 'Doinel',
					password: 'DODO1234!',
					passwordConfirmation: 'DODO1234!'
				};

				const errorPayload =
					'Password must contain at least one lowercase letter!';

				it('should return a 400 with an error payload', async () => {
					const { statusCode, body } = await supertest(server)
						.post(POST_USERS_ENDPOINT)
						.send(inputBody);

					expect(statusCode).toBe(400);
					expect(body.error).toEqual(errorPayload);
				});
			});

			describe("doesn't contain at least one number", () => {
				const inputBody = {
					email: `doinel${emailIndex++}@gmail.com`,
					name: 'Doinel',
					password: 'Dodonel!',
					passwordConfirmation: 'Dodonel!'
				};

				const errorPayload =
					'Password must contain at least one number!';

				it('should return a 400 with an error payload', async () => {
					const { statusCode, body } = await supertest(server)
						.post(POST_USERS_ENDPOINT)
						.send(inputBody);

					expect(statusCode).toBe(400);
					expect(body.error).toEqual(errorPayload);
				});
			});

			describe("doesn't contain at least special character", () => {
				const inputBody = {
					email: `doinel${emailIndex++}@gmail.com`,
					name: 'Doinel',
					password: 'Dodo1234',
					passwordConfirmation: 'Dodo1234'
				};

				const errorPayload =
					'Password must contain at least one special character!';

				it('should return a 400 with an error payload', async () => {
					const { statusCode, body } = await supertest(server)
						.post(POST_USERS_ENDPOINT)
						.send(inputBody);

					expect(statusCode).toBe(400);
					expect(body.error).toEqual(errorPayload);
				});
			});
		});

		describe('faulty PASSWORD and PASSWORD CONFIRMATION', () => {
			const inputBody = {
				email: `doinel${emailIndex++}@gmail.com`,
				name: 'Doinel',
				password: 'Dodo1234!',
				passwordConfirmation: 'Dodo1234'
			};

			const errorPayload = 'Passwords must match!';

			it('should return a 400 with an error payload', async () => {
				const { statusCode, body } = await supertest(server)
					.post(POST_USERS_ENDPOINT)
					.send(inputBody);

				expect(statusCode).toBe(400);
				expect(body.error).toEqual(errorPayload);
			});
		});
	});
});
