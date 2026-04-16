package com.rainbowforest.shippingservice.controller;

import com.rainbowforest.shippingservice.domain.Shipping;
import com.rainbowforest.shippingservice.service.ShippingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/shipping")
public class ShippingController {

    @Autowired
    private ShippingService shippingService;

    @GetMapping
    public ResponseEntity<java.util.List<Shipping>> getAllShipping() {
        return new ResponseEntity<>(shippingService.getAllShipping(), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Shipping> createShipping(@RequestParam Long orderId, @RequestParam String address) {
        Shipping shipping = shippingService.createShipping(orderId, address);
        return new ResponseEntity<>(shipping, HttpStatus.CREATED);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<Shipping> getByOrderId(@PathVariable Long orderId) {
        return shippingService.getShippingByOrderId(orderId)
                .map(shipping -> new ResponseEntity<>(shipping, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Shipping> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return shippingService.updateStatus(id, status)
                .map(shipping -> new ResponseEntity<>(shipping, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}
