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
router.get(
  '/',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  bookingControllers.getAllBooking
);

// GET USER'S BOOKING
router.get(
  '/my-bookings',
  checkAuth(...Object.values(Role)),
  bookingControllers.getUserBookings
);

// GET BOOKING BY BOOKING ID
router.get(
  '/:bookingId',
  checkAuth(...Object.values(Role)),
  bookingControllers.getBookingById
);

// UPDATE BOOKING STATUS
router.patch(
  '/:bookingId',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  bookingControllers.updateBookingStatus
);

export const bookingRouter = router;
