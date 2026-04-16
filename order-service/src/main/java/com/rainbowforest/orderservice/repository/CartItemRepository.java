package com.rainbowforest.orderservice.repository;

import com.rainbowforest.orderservice.domain.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
}
