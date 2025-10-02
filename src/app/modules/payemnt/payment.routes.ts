import { Router } from "express";
import { paymentController } from "./payment.controller";

const router = Router();

router.get('/payment_success', paymentController.successPayment);
router.get('/payment_fail', paymentController.failedPayment);
router.get('/payment_cancel', paymentController.cancelPayment);

export const paymentRouter = router;