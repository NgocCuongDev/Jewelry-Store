package com.rainbowforest.paymentservice.service;

import com.rainbowforest.paymentservice.domain.Payment;
import com.rainbowforest.paymentservice.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public Payment processPayment(Long orderId, Long userId, BigDecimal amount, String method) {
        Payment payment = new Payment();
        payment.setOrderId(orderId);
        payment.setUserId(userId);
        payment.setAmount(amount);
        payment.setPaymentMethod(method != null ? method : "CASH_ON_DELIVERY");
        payment.setTransactionDate(LocalDateTime.now());
        
        // Simulating a successful payment logic
        payment.setStatus("SUCCESS");
        
        return paymentRepository.save(payment);
    }

    public List<Payment> getPaymentsByOrderId(Long orderId) {
        return paymentRepository.findByOrderId(orderId);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
}
