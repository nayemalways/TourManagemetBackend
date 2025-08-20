import express, { NextFunction, Request, Response } from "express";
import { authControllers } from "./auth.controller";
import { checkAuth } from "../middlewares/auth.middleware";
import { Role } from "../modules/user/user.interface";
import passport from "passport";

const router = express.Router();

router.post('/login', authControllers.credentialsLogin);
router.post('/refresh-token', authControllers.getNewAccessToken);
router.post('/logout', authControllers.logout);
router.post('/reset-password', checkAuth(...Object.values(Role)), authControllers.resetPassword);
router.get('/google', (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query?.redirect || "/";
    passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string, prompt: "consent select_account"})(req, res, next);
})

router.get("/google/callback", passport.authenticate("google", {failureRedirect: "/login"}) , authControllers.googleCallback)


export const authRoutes = router;