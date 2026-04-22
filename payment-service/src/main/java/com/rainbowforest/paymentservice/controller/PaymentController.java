package com.rainbowforest.paymentservice.controller;

import com.rainbowforest.paymentservice.domain.Payment;
import com.rainbowforest.paymentservice.dto.VNPayCallbackDTO;
import com.rainbowforest.paymentservice.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return new ResponseEntity<>(paymentService.getAllPayments(), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Payment> process(@RequestParam Long orderId, 
                                          @RequestParam Long userId, 
                                          @RequestParam BigDecimal amount,
                                          @RequestParam(required = false) String method) {
        Payment payment = paymentService.processPayment(orderId, userId, amount, method);
        return new ResponseEntity<>(payment, HttpStatus.CREATED);
    }

    // Endpoint cho VNPay Callback từ Node.js Service
    @PostMapping("/vnpay/callback")
    public ResponseEntity<Payment> vnpayCallback(@RequestBody VNPayCallbackDTO callbackData) {
        System.out.println("📩 Received VNPay Callback for Order: " + callbackData.getOrderId());
        
        // Chuyển đổi orderId từ String sang Long (VNPAY có thể gửi prefix như ORD_)
        String cleanId = callbackData.getOrderId().replaceAll("[^0-9]", "");
        Long orderId = Long.parseLong(cleanId);
        
        Payment payment = paymentService.saveVNPayPayment(
            orderId, 
            callbackData.getTransactionNo(), 
            callbackData.getAmount(), 
            callbackData.getStatus(), 
            callbackData.getBankCode()
        );
        
        return new ResponseEntity<>(payment, HttpStatus.OK);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<Payment>> getByOrder(@PathVariable Long orderId) {
        List<Payment> payments = paymentService.getPaymentsByOrderId(orderId);
        return new ResponseEntity<>(payments, HttpStatus.OK);
    }
}
