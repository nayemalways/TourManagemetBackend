import { UserControllers } from "./user.controller";
import { UserZodSchema } from "./user.validate";
import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/auth.middleware";
import { Role } from "./user.interface";


const router = Router();

router.post('/register', validateRequest(UserZodSchema),  UserControllers.createUser);
router.get('/get-users', checkAuth(Role.ADMIN, Role.SUPER_ADMIN) , UserControllers.allUsers);

export const UserRoute = router;