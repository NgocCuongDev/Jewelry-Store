package com.rainbowforest.orderservice.repository;

import com.rainbowforest.orderservice.domain.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    @Modifying
    @Query("DELETE FROM CartItem c WHERE c.cart.cartId = :cartId AND c.product.catalogId = :catalogId")
    void deleteByCartIdAndCatalogId(@Param("cartId") String cartId, @Param("catalogId") Long catalogId);

    @Modifying
    @Query("DELETE FROM CartItem c WHERE c.cart.cartId = :cartId")
    void deleteAllByCart_CartId(@Param("cartId") String cartId);

    @Modifying
    @Query("UPDATE CartItem c SET c.quantity = :quantity, c.subTotal = :subTotal WHERE c.cart.cartId = :cartId AND c.product.catalogId = :catalogId")
    void updateQuantityAndSubTotal(@Param("cartId") String cartId, @Param("catalogId") Long catalogId, @Param("quantity") int quantity, @Param("subTotal") BigDecimal subTotal);
}
