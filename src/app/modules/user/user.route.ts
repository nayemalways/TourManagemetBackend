import { Router } from "express";
import { UserControllers } from "./user.controller";


const router = Router();


router.post('/register', UserControllers.createUser);
router.get('/get-users', UserControllers.allUsers);


export const UserRoute = router;