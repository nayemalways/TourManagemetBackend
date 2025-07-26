import express, { Request, Response } from 'express';
import cors from 'cors';
import { router } from './app/routes';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import { NotFound } from './app/middlewares/NotFound';


const app = express();


app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
    res.send("Welcome to the show")
})

// GLOBAL ROUTES
app.use('/api/v1', router);

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);


// NO ROUTE MATCH
app.use(NotFound)

export default app;