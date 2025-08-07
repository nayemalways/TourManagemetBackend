import express from "express";
import { authControllers } from "./auth.controller";

const router = express.Router();

router.post('/login', authControllers.credentialsLogin);
router.post('/refresh-token', authControllers.getNewAccessToken);


export const authRoutes = router;