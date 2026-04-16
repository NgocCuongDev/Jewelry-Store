package com.rainbowforest.shippingservice.repository;

import com.rainbowforest.shippingservice.domain.Shipping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ShippingRepository extends JpaRepository<Shipping, Long> {
    Optional<Shipping> findByOrderId(Long orderId);
    Optional<Shipping> findByTrackingNumber(String trackingNumber);
}
