package com.rainbowforest.orderservice.feignclient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.math.BigDecimal;

@FeignClient(name = "payment-service", url = "http://localhost:8900")
public interface PaymentClient {

    @PostMapping("/api/payment")
    PaymentDto process(@RequestParam("orderId") Long orderId, 
                      @RequestParam("userId") Long userId, 
                      @RequestParam("amount") BigDecimal amount,
                      @RequestParam(value = "method", required = false) String method);
}
