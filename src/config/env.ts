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
    
    
}

const loadEnvVarbles = (): EnvInterfaces => {
    const requireEnvVariables: string[] = ["PORT", "MONGO_URI", "JWT_SECRET", "NODE_ENV", "JWT_SECRET", "JWT_EXPIRATION", "JWT_REFRESH_SECRET", "JWT_REFRESH_EXPIRATION", "BCRYPT_SALT_ROUND", "SUPER_ADMIN_PASSWORD", "SUPER_ADMIN_GMAIL"];

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
    }
}



export default loadEnvVarbles();