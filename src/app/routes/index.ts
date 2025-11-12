import { Router } from 'express';
import { UserRoute } from '../modules/user/user.route';
import { authRoutes } from '../modules/auth/auth.route';
import { DivisionRouter } from '../modules/division/division.routes';
import { tourRouter } from '../modules/tour/tour.routes';
import { bookingRouter } from '../modules/booking/booking.routes';
import { paymentRouter } from '../modules/payemnt/payment.routes';
import { otpRoutes } from '../modules/otp/otp.routes';
import { statsRouter } from '../modules/states/states.route';

export const router = Router();

const moduleRoutes = [
  {
    path: '/user',
    route: UserRoute,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/division',
    route: DivisionRouter,
  },
  {
    path: '/tour',
    route: tourRouter,
  },
  {
    path: '/booking',
    route: bookingRouter,
  },
  {
    path: '/payment',
    route: paymentRouter,
  },
  {
    path: '/otp',
    route: otpRoutes,
  },
  {
    path: '/stats',
    route: statsRouter,
  },
];

moduleRoutes.forEach((r) => {
  router.use(r.path, r.route);
});
