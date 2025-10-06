/* eslint-disable no-console */
import axios from 'axios';
import env from '../../config/env';
import { ISSL_commerz } from './ssl_commerz.interface';
import AppError from '../../errorHelpers/AppError';

export const SSL_Payment = async (payload: ISSL_commerz) => {
  const data = {
    store_id: env.STORE_ID,
    store_passwd: env.STORE_PASSWORD,
    total_amount: payload.amount,
    currency: 'BDT',
    tran_id: payload.transactionId, // Unique
    success_url: `${env.BACKEND_SUCCESS_URL}?transection_id=${payload.transactionId}&amount=${payload.amount}&status=success`,
    fail_url: `${env.BACKEND_FAIL_URL}?transection_id=${payload.transactionId}&amount=${payload.amount}&status=fail`,
    cancel_url: `${env.BACKEND_CANCEL_URL}?transection_id=${payload.transactionId}&amount=${payload.amount}&status=cancel`,
    ipn_url: `http://localhost:5002/api/v1/ipn`,
    shipping_method: 'Courier',
    product_name: 'Computer',
    product_category: 'Electronic',
    product_profile: 'general',
    cus_name: payload.name,
    cus_email: payload.email,
    cus_add1: payload.address,
    cus_add2: 'Dhaka',
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: payload.phone,
    cus_fax: '017888888',
    ship_name: '017888888',
    ship_add1: 'Dhaka',
    ship_add2: 'Dhaka',
    ship_city: 'Dhaka',
    ship_state: 'Dhaka',
    ship_postcode: '1000',
    ship_country: 'Bangladesh',
  };

  try {
    const result = await axios({
      method: 'POST',
      url: env.SSL_PAYMENT_API,
      data: data,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    return await result.data;
  } catch (error) {
    console.log('SSL_Commerz Payment Error :', error);
    throw new AppError(400, 'SSL_Commerz payment failed');
  }
};
