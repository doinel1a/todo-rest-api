import { object, string, TypeOf } from 'zod';

const createUserSchema = object({
	body: object({
		email: string()
			.min(1, 'E-mail is required!')
			.max(30, 'E-mail must be at most 30 charactes long!')
			.email('E-mail must be valid!'),
		name: string()
			.min(1, 'Name is required!')
			.max(30, 'Name must be at most 30 charactes long!'),
		password: string()
			.min(8, 'Password must be at least 8 characters!')
			.max(40, 'Password must be at most 40 charactes long!')
			.regex(
				/(?=.*[A-Z])/,
				'Password must contain at least one uppercase letter!'
			)
			.regex(
				/(?=.*[a-z])/,
				'Password must contain at least one lowercase letter!'
			)
			.regex(/(?=.*\d)/, 'Password must contain at least one number!')
			.regex(
				/(?=.*[!#$%&*@^])/,
				'Password must contain at least one special character!'
			),
		passwordConfirmation: string({
			required_error: 'Password confirmation is required!'
		})
	})
		.refine((data) => data.password === data.passwordConfirmation, {
			message: 'Passwords must match!',
			path: ['passwordConfirmation']
		})
		.refine(
			(data) =>
				data.name ===
				data.name.match(/\p{L}/gu)?.toString().replaceAll(',', ''),
			{
				message: 'Name must include only latin characters!',
				path: ['name']
			}
		)
});

type CreateUserInput = Omit<
	TypeOf<typeof createUserSchema>,
	'body.passwordConfirmation'
>;

export default createUserSchema;
export { CreateUserInput };
