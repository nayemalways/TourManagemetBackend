/* eslint-disable no-console */
import env from '../config/env';
import { IUser, Role } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';
import { IAuthProvider } from './../modules/user/user.interface';

export const superAdminCreate = async () => {
  try {
    const isUserExist = await User.findOne({ email: env?.SUPER_ADMIN_GMAIL });
    if (isUserExist) {
      console.log('Super Admin Already Created');
      return;
    }

    const authProvider: IAuthProvider = {
      provider: 'credentials',
      providerId: env?.SUPER_ADMIN_GMAIL,
    };

    const payload: IUser = {
      name: 'Nayem',
      email: env?.SUPER_ADMIN_GMAIL,
      password: env?.SUPER_ADMIN_PASSWORD,
      role: Role.SUPER_ADMIN,
      auths: [authProvider],
    };

    const super_admin = await User.create(payload);
    console.log(super_admin);
  } catch (error) {
    console.log(error);
  }
};
