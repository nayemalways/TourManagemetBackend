import { Router } from 'express';
import { paymentController } from './payment.controller';

const router = Router();

router.post('/payment_success', paymentController.successPayment);
router.post('/payment_fail', paymentController.failedPayment);
router.post('/payment_cancel', paymentController.cancelPayment);

export const paymentRouter = router;
