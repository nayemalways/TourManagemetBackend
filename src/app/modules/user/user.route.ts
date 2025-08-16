import { UserControllers } from "./user.controller";
import { UserUpdateZodSchema, UserZodSchema } from "./user.validate";
import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/auth.middleware";
import { Role } from "./user.interface";


const router = Router();

router.post('/register', validateRequest(UserZodSchema),  UserControllers.createUser);
router.get('/get-users', checkAuth(...Object.values(Role)) , UserControllers.allUsers);
router.patch('/:userId', validateRequest(UserUpdateZodSchema), checkAuth(...Object.values(Role)) , UserControllers.updateUser);

export const UserRoute = router;