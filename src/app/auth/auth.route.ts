import express from "express";
import { authControllers } from "./auth.controller";

const router = express.Router();

router.post('/login', authControllers.credentialsLogin);
router.post('/refresh-token', authControllers.getNewAccessToken);
router.post('/logout', authControllers.logout);


export const authRoutes = router;