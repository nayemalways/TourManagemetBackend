/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from 'passport';
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from 'passport-google-oauth20';
import env from './env';
import { User } from '../modules/user/user.model';
import { Role } from '../modules/user/user.interface';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';

// User Login
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email', // renamed same as mongoose schema "email"
      passwordField: 'password', // renamed same as mongoose schema "password"
    },
    async (email: string, password: string, done: any) => {
      try {
        const isUserExists = await User.findOne({ email });

        if (!isUserExists)
          return done(null, false, { message: 'User does not exist!' });

        const isGoogleAuthenticated = isUserExists.auths?.some(
          (provider) => provider.provider === 'google'
        );

        if (isGoogleAuthenticated && !isUserExists.password) {
          return done(null, false, {
            message:
              'You are authenticated through Google. So if you want to login with credentials, then at first login with google and set a password to your gmail and then you can login with email and password',
          });
        }

        // Matching Password
        const passwordMatch = await bcrypt.compare(
          password as string,
          isUserExists.password as string
        );
        if (!passwordMatch) {
          return done(null, false, { message: 'Incorrect password!' });
        }

        return done(null, isUserExists);
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);

// Google OAuth for user create
passport.use(
  new GoogleStrategy(
    {
      clientID: env?.GOOGLE_CLIENT_ID,
      clientSecret: env?.GOOGLE_CLIENT_SECRET,
      callbackURL: env?.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(null, false, { message: 'No email found' });
        }

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            picture: profile.photos?.[0].value,
            role: Role.USER,
            auths: [
              {
                provider: 'google',
                providerId: profile.id,
              },
            ],
          });
        }

        return done(null, user);
      } catch (error) {
        console.log('Google strategy error', error);
        done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.log(error);
    done(error);
  }
});
