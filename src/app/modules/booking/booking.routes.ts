import { Router } from "express";
import { bookingControllers } from "./booking.controller";
import { checkAuth } from "../../middlewares/auth.middleware";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createBookingZodSchema } from "./booking.zodSchema";

const router = Router();

router.post('/', checkAuth(...Object.values(Role)), validateRequest(createBookingZodSchema), bookingControllers.createBooking);


export const bookingRouter = router;