import { genSalt, hash } from 'bcrypt';
import config from 'config';
import { Document, model, Schema } from 'mongoose';

interface UserDocument extends Document {
	email: string;
	name: string;
	password: string;
	createdAt: Date;
	updatedAt: Date;
	comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true
		},
		name: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		}
	},
	{ timestamps: true }
);

UserSchema.pre('save', async function (next) {
	const user = this as UserDocument; //POSSIBLE ERROR

	if (!user.isModified('password')) return next();

	const saltWorkFactor = config.get<number>('saltWorkFactor');
	const salt = await genSalt(saltWorkFactor);

	const hashedPassword = await hash(user.password, salt);

	user.password = hashedPassword;

	return next();
});

const UserModel = model<UserDocument>('User', UserSchema);

export default UserModel;
export { UserDocument };
