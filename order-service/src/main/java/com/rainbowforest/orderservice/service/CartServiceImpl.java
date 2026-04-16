package com.rainbowforest.orderservice.service;

import com.rainbowforest.orderservice.domain.Cart;
import com.rainbowforest.orderservice.domain.CartItem;
import com.rainbowforest.orderservice.domain.Item;
import com.rainbowforest.orderservice.domain.Product;
import com.rainbowforest.orderservice.feignclient.ProductClient;
import com.rainbowforest.orderservice.repository.CartItemRepository;
import com.rainbowforest.orderservice.repository.CartRepository;
import com.rainbowforest.orderservice.repository.ProductRepository;
import com.rainbowforest.orderservice.utilities.CartUtilities;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CartServiceImpl implements CartService {

    @Autowired
    private ProductClient productClient;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    private Cart getOrCreateCart(String cartId) {
        final String finalCartId = (cartId == null) ? "default-cart" : cartId;
        return cartRepository.findByCartId(finalCartId)
                .orElseGet(() -> cartRepository.save(new Cart(finalCartId)));
    }

    @Override
    public void addItemToCart(String cartId, Long productId, Integer quantity) {
        Cart cart = getOrCreateCart(cartId);
        
        // Kiểm tra xem sản phẩm đã có trong database local chưa by catalog_id (catalogId)
        Product product = productRepository.findByCatalogId(productId)
                .map(existingProduct -> {
                    // Cập nhật thông tin mới nhất từ catalog service để đồng bộ ImageUrl, Description, v.v.
                    Product latest = productClient.getProductById(productId);
                    if (latest != null) {
                        existingProduct.setImageUrl(latest.getImageUrl());
                        existingProduct.setProductName(latest.getProductName());
                        existingProduct.setPrice(latest.getPrice());
                        existingProduct.setDescription(latest.getDescription());
                        existingProduct.setCategory(latest.getCategory());
                        existingProduct.setAvailability(latest.getAvailability());
                        return productRepository.save(existingProduct);
                    }
                    return existingProduct;
                })
                .orElseGet(() -> {
                    Product p = productClient.getProductById(productId);
                    if (p == null) {
                        throw new RuntimeException("Product not found");
                    }
                    return productRepository.save(p);
                });

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getCatalogId() != null && item.getProduct().getCatalogId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            item.setSubTotal(CartUtilities.getSubTotalForItem(product, item.getQuantity()));
        } else {
            CartItem newItem = new CartItem(quantity, product, CartUtilities.getSubTotalForItem(product, quantity), cart);
            cart.getItems().add(newItem);
        }
        cartRepository.save(cart);
    }

    @Override
    public List<Object> getCart(String cartId) {
        Cart cart = getOrCreateCart(cartId);
        return new ArrayList<>(cart.getItems());
    }

    @Override
    public void changeItemQuantity(String cartId, Long productId, Integer quantity) {
        Cart cart = getOrCreateCart(cartId);
        cart.getItems().stream()
                .filter(item -> item.getProduct() != null && item.getProduct().getCatalogId() != null && item.getProduct().getCatalogId().equals(productId))
                .findFirst()
                .ifPresent(item -> {
                    item.setQuantity(quantity);
                    item.setSubTotal(CartUtilities.getSubTotalForItem(item.getProduct(), quantity));
                });
        cartRepository.save(cart);
    }

    @Override
    public void deleteItemFromCart(String cartId, Long productId) {
        Cart cart = getOrCreateCart(cartId);
        cart.getItems().removeIf(item -> item.getProduct() != null && item.getProduct().getCatalogId() != null && item.getProduct().getCatalogId().equals(productId));
        cartRepository.save(cart);
    }

    @Override
    public boolean checkIfItemIsExist(String cartId, Long productId) {
        Cart cart = getOrCreateCart(cartId);
        return cart.getItems().stream()
                .anyMatch(item -> item.getProduct() != null && item.getProduct().getCatalogId() != null && item.getProduct().getCatalogId().equals(productId));
    }

    @Override
    public List<Item> getAllItemsFromCart(String cartId) {
        Cart cart = getOrCreateCart(cartId);
        // Chuyển đổi từ CartItem (Shopping Cart) sang Item (Order domain)
        return cart.getItems().stream()
                .map(cartItem -> new Item(cartItem.getQuantity(), cartItem.getProduct(), cartItem.getSubTotal()))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteCart(String cartId) {
        cartRepository.findByCartId(cartId).ifPresent(cart -> cartRepository.delete(cart));
    }
}
