import { UserControllers } from "./user.controller";
import { UserZodSchema } from "./user.validate";
import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";


const router = Router();

router.post('/register', validateRequest(UserZodSchema),  UserControllers.createUser);
router.get('/get-users', UserControllers.allUsers);

export const UserRoute = router;