import { object, string, TypeOf } from 'zod';

const createSessionSchema = object({
	body: object({
		email: string({ required_error: 'E-mail is required!' }).email(
			'E-mail must be valid!'
		),
		password: string({ required_error: 'Password is required!' })
	})
});

type CreateSessionInput = Omit<
	TypeOf<typeof createSessionSchema>,
	'body.passwordConfirmation'
>;

export default createSessionSchema;
export { CreateSessionInput };
