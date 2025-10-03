import dotenv from 'dotenv';
dotenv.config();

interface EnvInterfaces {
  PORT: string;
  MONGO_URI: string;
  NODE_ENV: 'development' | 'production';
  JWT_SECRET: string;
  JWT_EXPIRATION: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRATION: string;
  BCRYPT_SALT_ROUND: string;
  SUPER_ADMIN_GMAIL: string;
  SUPER_ADMIN_PASSWORD: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CALLBACK_URL: string;
  EXPRESS_SESSION_SECRET: string;
  FRONTEND_URL: string;

  CLOUDINARY_SECRET: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_NAME: string;

  STORE_ID: string;
  STORE_PASSWORD: string;
  SSL_PAYMENT_API: string;
  CLIENT_SUCCESS_URL: string;
  CLIENT_FAIL_URL: string;
  CLIENT_CANCEL_URL: string;
  BACKEND_SUCCESS_URL: string;
  BACKEND_FAIL_URL: string;
  BACKEND_CANCEL_URL: string;
}

const loadEnvVarbles = (): EnvInterfaces => {
  const requireEnvVariables: string[] = [
    'PORT',
    'MONGO_URI',
    'JWT_SECRET',
    'NODE_ENV',
    'JWT_SECRET',
    'JWT_EXPIRATION',
    'JWT_REFRESH_SECRET',
    'JWT_REFRESH_EXPIRATION',
    'BCRYPT_SALT_ROUND',
    'SUPER_ADMIN_PASSWORD',
    'SUPER_ADMIN_GMAIL',
    'FRONTEND_URL',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CALLBACK_URL',
    'EXPRESS_SESSION_SECRET',
    'CLOUDINARY_NAME',
    'CLOUDINARY_SECRET',
    'CLOUDINARY_API_KEY',
    'STORE_ID',
    'STORE_PASSWORD',
    'SSL_PAYMENT_API',
    'CLIENT_SUCCESS_URL',
    'CLIENT_FAIL_URL',
    'CLIENT_CANCEL_URL',
    'BACKEND_SUCCESS_URL',
    'BACKEND_FAIL_URL',
    'BACKEND_CANCEL_URL',
  ];

  requireEnvVariables.forEach((KEY) => {
    if (!process.env[KEY]) {
      throw new Error(`Missing required env variable ${KEY}`);
    }
  });

  return {
    MONGO_URI: process.env.MONGO_URI as string,
    PORT: process.env.PORT as string,
    NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
    JWT_EXPIRATION: process.env.JWT_EXPIRATION as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION as string,
    SUPER_ADMIN_GMAIL: process.env.SUPER_ADMIN_GMAIL as string,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
    CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET as string,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
    CLOUDINARY_NAME: process.env.CLOUDINARY_NAME as string,
    STORE_ID: process.env.STORE_ID as string,
    STORE_PASSWORD: process.env.STORE_PASSWORD as string,
    SSL_PAYMENT_API: process.env.SSL_PAYMENT_API as string,
    CLIENT_SUCCESS_URL: process.env.CLIENT_SUCCESS_URL as string,
    CLIENT_FAIL_URL: process.env.CLIENT_FAIL_URL as string,
    CLIENT_CANCEL_URL: process.env.CLIENT_CANCEL_URL as string,
    BACKEND_SUCCESS_URL: process.env.BACKEND_SUCCESS_URL as string,
    BACKEND_FAIL_URL: process.env.BACKEND_FAIL_URL as string,
    BACKEND_CANCEL_URL: process.env.BACKEND_CANCEL_URL as string,
  };
};

export default loadEnvVarbles();
