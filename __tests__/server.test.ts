import request from 'supertest';

import initServer from '../src/server';

const server = initServer();

describe('server', () => {
	describe('given a wrong endpoint', () => {
		it('should not work', (done) => {
			request(server)
				.get('/api/random-endpoint')
				.set('Accept', 'application/json')
				.expect('Content-Type', 'text/html; charset=utf-8')
				.expect(404, done);
		});
	});

	describe('given the healthcheck endpoint', () => {
		it('should respond with a 200 status code & a json message', (done) => {
			request(server)
				.get('/api/healthcheck')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200, done);
		});
	});
});
