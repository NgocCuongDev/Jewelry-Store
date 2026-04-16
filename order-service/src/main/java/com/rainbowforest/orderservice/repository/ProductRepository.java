package com.rainbowforest.orderservice.repository;

import com.rainbowforest.orderservice.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findByCatalogId(Long catalogId);
}
