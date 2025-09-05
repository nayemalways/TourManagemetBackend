import dotenv from 'dotenv';
dotenv.config();


interface EnvInterfaces {
    PORT: string;
    MONGO_URI: string;
    NODE_ENV: 'development' | 'production';
    JWT_SECRET: string,
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
    
}

const loadEnvVarbles = (): EnvInterfaces => {
    const requireEnvVariables: string[] = ["PORT", "MONGO_URI", "JWT_SECRET", "NODE_ENV", "JWT_SECRET", "JWT_EXPIRATION", "JWT_REFRESH_SECRET", "JWT_REFRESH_EXPIRATION", "BCRYPT_SALT_ROUND", "SUPER_ADMIN_PASSWORD", "SUPER_ADMIN_GMAIL", "FRONTEND_URL", "GOOGLE_CLIENT_SECRET", "GOOGLE_CLIENT_ID", "GOOGLE_CALLBACK_URL", "EXPRESS_SESSION_SECRET", "CLOUDINARY_NAME", "CLOUDINARY_SECRET", "CLOUDINARY_API_KEY"];

    requireEnvVariables.forEach(KEY => {
        if(!process.env[KEY]) {
            throw new Error(`Missing required env variable ${KEY}`)
        }
    })

    return {
        MONGO_URI: process.env.MONGO_URI as string,
        PORT:  process.env.PORT as string,
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
        CLOUDINARY_SECRET: process.env.GOOGLE_CALLBACK_URL as string,
        CLOUDINARY_API_KEY: process.env.GOOGLE_CALLBACK_URL as string,
        CLOUDINARY_NAME: process.env.GOOGLE_CALLBACK_URL as string,
    }
}



export default loadEnvVarbles();