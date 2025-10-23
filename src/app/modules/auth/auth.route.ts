import express from 'express';
import { authControllers } from './auth.controller';
import { checkAuth } from '../../middlewares/auth.middleware';
import { Role } from '../user/user.interface';
import passport from 'passport';


const router = express.Router();

router.post('/login', authControllers.credentialsLogin);
router.post('/refresh-token', authControllers.getNewAccessToken);
router.post('/logout', authControllers.logout);
router.post('/change-password', checkAuth(...Object.values(Role)), authControllers.changePassword);
router.post('/set-password', checkAuth(...Object.values(Role)) , authControllers.setPassword);
router.post("/reset-password", checkAuth(...Object.values(Role)), authControllers.resetPassword);
router.post('/forget-password', authControllers.forgetPassword);

// GOOGLE
router.get('/google', authControllers.googleRegister);
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), authControllers.googleCallback);

export const authRoutes = router;
