import dotenv from 'dotenv';
dotenv.config();

const envVars = {
    MONGO_URI: process.env.MONGO_URI as string,
    PORT:  process.env.PORT as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
    NODE_ENV: process.env.NODE_ENV as string
}

export default envVars;