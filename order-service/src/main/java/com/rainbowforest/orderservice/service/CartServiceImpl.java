package com.rainbowforest.orderservice.service;

import com.rainbowforest.orderservice.domain.Cart;
import com.rainbowforest.orderservice.domain.CartItem;
import com.rainbowforest.orderservice.domain.Item;
import com.rainbowforest.orderservice.domain.Product;
import com.rainbowforest.orderservice.feignclient.ProductClient;
import com.rainbowforest.orderservice.feignclient.ProductDto;
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

    @Autowired
    private CartItemRepository cartItemRepository;

    private Cart getOrCreateCart(String cartId) {
        final String finalCartId = (cartId == null) ? "default-cart" : cartId;
        return cartRepository.findByCartId(finalCartId)
                .orElseGet(() -> cartRepository.save(new Cart(finalCartId)));
    }

    @Override
    public void addItemToCart(String cartId, Long productId, Integer quantity) {
        Cart cart = getOrCreateCart(cartId);
        
        // Kiểm tra sản phẩm từ Catalog (Product Service)
        Product product = productRepository.findByCatalogId(productId)
                .map(existingProduct -> {
                    ProductDto latest = productClient.getProductById(productId);
                    if (latest != null) {
                        existingProduct.setImageUrl(latest.getImageUrl());
                        existingProduct.setProductName(latest.getProductName());
                        existingProduct.setPrice(latest.getDiscountPrice() != null ? latest.getDiscountPrice() : latest.getPrice());
                        existingProduct.setDescription(latest.getDescription());
                        if (latest.getCategory() != null) {
                            existingProduct.setCategory(String.valueOf(latest.getCategory().getOrDefault("categoryName", "Chưa phân loại")));
                        }
                        existingProduct.setAvailability(latest.getAvailability());
                        return productRepository.save(existingProduct);
                    }
                    return existingProduct;
                })
                .orElseGet(() -> {
                    ProductDto pDto = productClient.getProductById(productId);
                    if (pDto == null) throw new RuntimeException("Product not found");
                    Product p = new Product();
                    p.setCatalogId(pDto.getId());
                    p.setProductName(pDto.getProductName());
                    p.setPrice(pDto.getDiscountPrice() != null ? pDto.getDiscountPrice() : pDto.getPrice());
                    p.setDescription(pDto.getDescription());
                    p.setCategory(pDto.getCategory() != null ? String.valueOf(pDto.getCategory().getOrDefault("categoryName", "Chưa phân loại")) : "Chưa phân loại");
                    p.setAvailability(pDto.getAvailability());
                    p.setImageUrl(pDto.getImageUrl());
                    return productRepository.save(p);
                });

        // TỐI ƯU HÓA: Tìm item đồng bộ và an toàn
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct() != null && productId.equals(item.getProduct().getCatalogId()))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            item.setSubTotal(CartUtilities.getSubTotalForItem(product, item.getQuantity()));
            cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem(quantity, product, CartUtilities.getSubTotalForItem(product, quantity), cart);
            cart.getItems().add(newItem);
            cartRepository.save(cart);
        }
    }

    @Override
    public List<Object> getCart(String cartId) {
        Cart cart = getOrCreateCart(cartId);
        return new ArrayList<>(cart.getItems());
    }

    @Override
    public void changeItemQuantity(String cartId, Long productId, Integer quantity) {
        Cart cart = getOrCreateCart(cartId);
        Product product = productRepository.findByCatalogId(productId).orElse(null);
        if (product != null) {
            java.math.BigDecimal newSubTotal = CartUtilities.getSubTotalForItem(product, quantity);
            cartItemRepository.updateQuantityAndSubTotal(cart.getCartId(), productId, quantity, newSubTotal);
        }
    }

    @Override
    public void deleteItemFromCart(String cartId, Long productId) {
        Cart cart = getOrCreateCart(cartId);
        cartItemRepository.deleteByCartIdAndCatalogId(cart.getCartId(), productId);
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

    @Override
    public void clearCart(String cartId) {
        cartItemRepository.deleteAllByCart_CartId(cartId);
    }
}
