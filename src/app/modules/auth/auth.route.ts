import express from 'express';
import { authControllers } from './auth.controller';
import { checkAuth } from '../../middlewares/auth.middleware';
import { Role } from '../user/user.interface';
import passport from 'passport';
import env from '../../config/env';
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();

router.post('/login', authControllers.credentialsLogin);
router.post('/refresh-token', authControllers.getNewAccessToken);
router.post('/logout', authControllers.logout);
router.post(
  '/change-password',
  checkAuth(...Object.values(Role)),
  authControllers.changePassword
);

router.post("/reset-password", checkAuth(...Object.values(Role)), authControllers.resetPassword);
router.post('/forget-password', authControllers.forgetPassword);



// This is my previous code: It returns a HTML Response thats why commented and newer version code is below. 
// That returns a JSON response with Google consent_screen link

/*
router.get('/google', (req: Request, res: Response, next: NextFunction) => {
  const redirect = req.query?.redirect || '/';

  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: redirect as string,
    prompt: 'consent select_account',
  })(req, res, next);

});
*/

router.get('/google', (req, res) => {
  const redirect = req.query.redirect || '/';
  const oauth2Client = new OAuth2Client(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    env.GOOGLE_CALLBACK_URL
  );

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email'],
    prompt: 'consent',
    state: redirect as string,
  });

  // Return URL as JSON instead of redirect
  res.json({ url });
});

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  authControllers.googleCallback
);

export const authRoutes = router;
