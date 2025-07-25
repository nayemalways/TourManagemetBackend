import express, { Request, Response } from 'express';
import cors from 'cors';
import { router } from './app/routes';
import { UserRoute } from './app/modules/user/user.route';

const app = express();


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}))

app.get('/', (req: Request, res: Response) => {
    res.send("Welcome to the show")
})

app.use('/api/v1', router);


export default app;