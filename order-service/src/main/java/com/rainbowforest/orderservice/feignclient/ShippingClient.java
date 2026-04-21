package com.rainbowforest.orderservice.feignclient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "shipping-service", url = "http://localhost:8900")
public interface ShippingClient {

    @PostMapping("/api/shipping")
    ShippingDto createShipping(@RequestParam("orderId") Long orderId, @RequestParam("address") String address);
}
