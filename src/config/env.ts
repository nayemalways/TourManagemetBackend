import dotenv from 'dotenv';
dotenv.config();


interface EnvInterfaces {
    PORT: string;
    MONGO_URI: string;
    JWT_SECRET: string,
    NODE_ENV: 'development' | 'production';
    JWT_EXPIRATION: string;
    BCRYPT_SALT_ROUND: string;
    
    
}

const loadEnvVarbles = (): EnvInterfaces => {
    const requireEnvVariables: string[] = ["PORT", "MONGO_URI", "JWT_SECRET", "NODE_ENV", "JWT_SECRET", "JWT_EXPIRATION", "BCRYPT_SALT_ROUND"];

    requireEnvVariables.forEach(KEY => {
        if(!process.env[KEY]) {
            throw new Error(`Missing required env variable ${KEY}`)
        }
    })

    return {
        MONGO_URI: process.env.MONGO_URI as string,
        PORT:  process.env.PORT as string,
        JWT_SECRET: process.env.JWT_SECRET as string,
        NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
        JWT_EXPIRATION: process.env.JWT_EXPIRATION as string
    }
}



export default loadEnvVarbles();