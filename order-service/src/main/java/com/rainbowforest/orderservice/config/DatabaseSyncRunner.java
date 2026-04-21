package com.rainbowforest.orderservice.config;

import com.rainbowforest.orderservice.domain.Order;
import com.rainbowforest.orderservice.domain.Product;
import com.rainbowforest.orderservice.feignclient.ProductClient;
import com.rainbowforest.orderservice.feignclient.ProductDto;
import com.rainbowforest.orderservice.repository.OrderRepository;
import com.rainbowforest.orderservice.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DatabaseSyncRunner implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductClient productClient;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Starting Product Synchronization...");
        List<Product> localProducts = productRepository.findAll();
        for (Product localProduct : localProducts) {
            try {
                if (localProduct.getCatalogId() == null) continue;
                ProductDto catalogProduct = productClient.getProductById(localProduct.getCatalogId());
                if (catalogProduct != null) {
                    localProduct.setImageUrl(catalogProduct.getImageUrl());
                    localProduct.setProductName(catalogProduct.getProductName());
                    localProduct.setPrice(catalogProduct.getDiscountPrice() != null ? catalogProduct.getDiscountPrice() : catalogProduct.getPrice());
                    localProduct.setDescription(catalogProduct.getDescription());
                    if (catalogProduct.getCategory() != null) {
                        localProduct.setCategory(String.valueOf(catalogProduct.getCategory().getOrDefault("categoryName", "Chưa phân loại")));
                    }
                    localProduct.setAvailability(catalogProduct.getAvailability());
                    productRepository.save(localProduct);
                    System.out.println("Synchronized Product: " + localProduct.getCatalogId());
                }
            } catch (Exception e) {
                System.err.println("Failed to sync product " + localProduct.getCatalogId() + ": " + e.getMessage());
            }
        }
        System.out.println("Product Synchronization Finished.");

        // System.out.println("Starting Order Data Population...");
        // List<Order> orders = orderRepository.findAll();
        // for (Order order : orders) {
        //     if (order.getShippingAddress() == null) {
        //         order.setShippingAddress("So 1 Dai Co Viet, Bach Khoa, Hai Ba Trung, Ha Noi");
        //         order.setCustName("Nguyen Van A");
        //         order.setCustPhone("0987654321");
        //         order.setPaymentMethod("COD");
        //         order.setShipMethod("Giao hang nhanh");
        //         order.setCustomerNote("Giao gio hanh chinh");
        //         orderRepository.save(order);
        //         System.out.println("Populated data for Order ID: " + order.getId());
        //     }
        // }
        // System.out.println("Order Data Population Finished.");
    }
}
