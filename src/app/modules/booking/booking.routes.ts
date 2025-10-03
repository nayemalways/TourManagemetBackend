import { Router } from 'express';
import { bookingControllers } from './booking.controller';
import { checkAuth } from '../../middlewares/auth.middleware';
import { Role } from '../user/user.interface';
import { validateRequest } from '../../middlewares/validateRequest';
import { createBookingZodSchema } from './booking.zodSchema';

const router = Router();

// CREATE BOOKING
router.post(
  '/',
  checkAuth(...Object.values(Role)),
  validateRequest(createBookingZodSchema),
  bookingControllers.createBooking
);

// GET ALL BOOKING
router.get('/', bookingControllers.getAllBooking);

export const bookingRouter = router;
