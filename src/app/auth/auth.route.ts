import express from "express";
import { authControllers } from "./auth.controller";
import { checkAuth } from "../middlewares/auth.middleware";
import { Role } from "../modules/user/user.interface";

const router = express.Router();

router.post('/login', authControllers.credentialsLogin);
router.post('/refresh-token', authControllers.getNewAccessToken);
router.post('/logout', authControllers.logout);
router.post('/reset-password', checkAuth(...Object.values(Role)), authControllers.resetPassword);


export const authRoutes = router;