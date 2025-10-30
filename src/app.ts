import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { router } from './app/routes';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import { NotFound } from './app/middlewares/NotFound';
import passport from 'passport';
import expressSession from 'express-session';
import './app/config/passport';
import env from './app/config/env';
import { swaggerSpec, swaggorUI } from './app/config/swaggor.config';

const app = express();

app.use(
  expressSession({
    secret: env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize()); // Initialized passport
app.use(passport.session()); // Create a session and handled all the thing
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/api-docs", swaggorUI.serve, swaggorUI.setup(swaggerSpec))

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the show');
});

// GLOBAL ROUTES
app.use('/api/v1', router);

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

// NO ROUTE MATCH
app.use(NotFound);

export default app;
