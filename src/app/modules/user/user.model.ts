/* eslint-disable @typescript-eslint/no-explicit-any */
import { model, Schema } from 'mongoose';
import { IAuthProvider, IsActive, IUser, Role } from './user.interface';
import bcrypt from 'bcrypt';
import env from '../../config/env';

// Embeded sub schema
const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  {
    versionKey: false,
    _id: false,
  }
);

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    phone: {
      type: String,
    },
    picture: {
      type: String,
    },
    address: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    auths: [authProviderSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Hashed password
userSchema.pre('save', async function (next) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  try {
    const hashedPassword = await bcrypt.hash(
      this.password as string,
      parseInt(env?.BCRYPT_SALT_ROUND)
    );
    this.password = hashedPassword;
    next();
  } catch (err: any) {
    next(err);
  }
});

export const User = model<IUser>('User', userSchema);
