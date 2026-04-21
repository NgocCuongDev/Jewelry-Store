package com.rainbowforest.orderservice.service;

import com.rainbowforest.orderservice.domain.Order;
import com.rainbowforest.orderservice.feignclient.ShippingClient;
import com.rainbowforest.orderservice.feignclient.PaymentClient;
import com.rainbowforest.orderservice.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private ShippingClient shippingClient;
    
    @Autowired
    private PaymentClient paymentClient;

    @Override
    public Order saveOrder(Order order) {
        // 1. Initial save of the order
        order.setStatus("PENDING");
        Order savedOrder = orderRepository.save(order);
        
        boolean paymentSuccess = false;
        boolean shippingSuccess = false;

        // 2. Process Payment
        try {
            System.out.println(">>> [ORDER INTEGRATION] PROCESSING PAYMENT FOR ORDER ID: " + savedOrder.getId());
            paymentClient.process(
                savedOrder.getId(), 
                savedOrder.getUser().getId(), 
                savedOrder.getTotal(), 
                savedOrder.getPaymentMethod()
            );
            paymentSuccess = true;
            System.out.println(">>> [ORDER INTEGRATION] PAYMENT SUCCESSFUL FOR ORDER ID: " + savedOrder.getId());
        } catch (Exception e) {
            System.err.println(">>> [ORDER INTEGRATION] PAYMENT FAILED FOR ORDER ID: " + savedOrder.getId());
            System.err.println(">>> [PAYMENT ERROR]: " + e.getMessage());
            e.printStackTrace();
            savedOrder.setStatus("PAYMENT_FAILED");
            savedOrder.setCustomerNote(savedOrder.getCustomerNote() != null ? 
                savedOrder.getCustomerNote() + " | Payment Error: " + e.getMessage() : 
                "Payment Error: " + e.getMessage());
        }

        // 3. Process Shipping (Only if payment was successful or if it's COD)
        boolean isCOD = "COD".equalsIgnoreCase(savedOrder.getPaymentMethod()) || 
                       "Cash on Delivery".equalsIgnoreCase(savedOrder.getPaymentMethod()) ||
                       "Thanh toán khi nhận hàng".equalsIgnoreCase(savedOrder.getPaymentMethod());

        if (paymentSuccess || isCOD) {
            try {
                System.out.println(">>> [ORDER INTEGRATION] CREATING SHIPPING FOR ORDER ID: " + savedOrder.getId());
                System.out.println(">>> [SHIPPING DATA] Address: " + savedOrder.getShippingAddress());
                shippingClient.createShipping(savedOrder.getId(), savedOrder.getShippingAddress());
                shippingSuccess = true;
                System.out.println(">>> [ORDER INTEGRATION] SHIPPING CREATED SUCCESSFULLY FOR ORDER ID: " + savedOrder.getId());
            } catch (Exception e) {
                System.err.println(">>> [ORDER INTEGRATION] SHIPPING FAILED FOR ORDER ID: " + savedOrder.getId());
                System.err.println(">>> [SHIPPING ERROR]: " + e.getMessage());
                e.printStackTrace();
                if (paymentSuccess) {
                    savedOrder.setStatus("SHIPPING_FAILED");
                }
            }
        } else {
            System.out.println(">>> [ORDER INTEGRATION] SHIPPING SKIPPED (Payment failed and not COD)");
        }

        // 4. Final Status Update
        if (paymentSuccess && shippingSuccess) {
            savedOrder.setStatus("CONFIRMED");
        } else if (isCOD && shippingSuccess) {
            savedOrder.setStatus("CONFIRMED");
        }

        return orderRepository.save(savedOrder);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    @Override
    public Order updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id).orElse(null);
        if (order != null) {
            order.setStatus(status);
            return orderRepository.save(order);
        }
        return null;
    }

    @Override
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUser_IdOrderByOrderedDateDesc(userId);
    }

    @Override
    public Order cancelOrder(Long id, String reason) {
        Order order = orderRepository.findById(id).orElse(null);
        if (order != null) {
            order.setStatus("CANCELLED");
            order.setCustomerNote(reason != null ? "Lý do hủy: " + reason : "Hủy đơn hàng");
            return orderRepository.save(order);
        }
        return null;
    }
}
