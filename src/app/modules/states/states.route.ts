import { Router } from 'express';
import { checkAuth } from '../../middlewares/auth.middleware';
import { Role } from '../user/user.interface';
import { statsControllers } from './states.controller';

const router = Router();

router.get(
  '/user',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  statsControllers.getUserStats
);
router.get(
  '/tour',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  statsControllers.getTourStats
);
router.get(
  '/booking',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  statsControllers.bookingStats
);
router.get(
  '/payment',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.USER),
  statsControllers.paymentStats
);

export const statsRouter = router;
