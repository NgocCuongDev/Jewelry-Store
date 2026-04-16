package com.rainbowforest.paymentservice.controller;

import com.rainbowforest.paymentservice.domain.Payment;
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

    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<Payment>> getByOrder(@PathVariable Long orderId) {
        List<Payment> payments = paymentService.getPaymentsByOrderId(orderId);
        return new ResponseEntity<>(payments, HttpStatus.OK);
    }
}
