import { Router } from 'express';
import { paymentController } from './payment.controller';
import { checkAuth } from '../../middlewares/auth.middleware';
import { Role } from '../user/user.interface';

const router = Router();

router.post('/init-payment/:booking_id', paymentController.initPayment);
router.post('/payment_success', paymentController.successPayment);
router.post('/payment_fail', paymentController.failedPayment);
router.post('/payment_cancel', paymentController.cancelPayment);
router.get('/invoice', checkAuth(...Object.keys(Role)),  paymentController.downloadInvoice);

export const paymentRouter = router;
