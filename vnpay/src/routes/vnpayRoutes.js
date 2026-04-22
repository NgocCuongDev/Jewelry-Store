// src/routes/vnpayRoutes.js
import express from 'express';
import { vnpayController } from '../controllers/vnpayController.js';

const router = express.Router();

// Tạo payment URL
router.post('/create-payment', vnpayController.createPayment);

// Xử lý return từ VNPay
router.get('/return', vnpayController.handleReturn);

// Xử lý IPN từ VNPay
router.get('/ipn', vnpayController.handleIPN);

export default router;