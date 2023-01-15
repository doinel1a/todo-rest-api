import { compare, genSalt, hash } from 'bcrypt';
import config from 'config';
import { Document, model, Schema } from 'mongoose';

interface UserInput {
	email: string;
	name: string;
	password: string;
}

interface UserDocument extends UserInput, Document {
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

UserSchema.methods.comparePassword = async function (
	candidatePassword: string
) {
	const user = this as UserDocument;

	return compare(candidatePassword, user.password).catch(() => false);
};

const UserModel = model<UserDocument>('User', UserSchema);

export default UserModel;
export { UserDocument, UserInput };
