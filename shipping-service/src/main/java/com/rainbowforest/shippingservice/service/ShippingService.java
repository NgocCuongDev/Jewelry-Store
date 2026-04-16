package com.rainbowforest.shippingservice.service;

import com.rainbowforest.shippingservice.domain.Shipping;
import com.rainbowforest.shippingservice.repository.ShippingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class ShippingService {

    @Autowired
    private ShippingRepository shippingRepository;

    public Shipping createShipping(Long orderId, String address) {
        Shipping shipping = new Shipping();
        shipping.setOrderId(orderId);
        shipping.setShippingAddress(address);
        shipping.setStatus("PENDING");
        shipping.setTrackingNumber(UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        shipping.setShippingDate(LocalDateTime.now());
        return shippingRepository.save(shipping);
    }

    public java.util.List<Shipping> getAllShipping() {
        return shippingRepository.findAll();
    }

    public Optional<Shipping> getShippingByOrderId(Long orderId) {
        return shippingRepository.findByOrderId(orderId);
    }

    public Optional<Shipping> updateStatus(Long id, String status) {
        return shippingRepository.findById(id).map(shipping -> {
            shipping.setStatus(status);
            return shippingRepository.save(shipping);
        });
    }
}
