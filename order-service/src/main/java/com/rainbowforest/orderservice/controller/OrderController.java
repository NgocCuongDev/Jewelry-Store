package com.rainbowforest.orderservice.controller;

import com.rainbowforest.orderservice.domain.Item;
import com.rainbowforest.orderservice.domain.Order;
import com.rainbowforest.orderservice.domain.User;
import com.rainbowforest.orderservice.feignclient.UserClient;
import com.rainbowforest.orderservice.http.header.HeaderGenerator;
import com.rainbowforest.orderservice.service.CartService;
import com.rainbowforest.orderservice.service.OrderService;
import com.rainbowforest.orderservice.utilities.OrderUtilities;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.servlet.http.HttpServletRequest;

@RestController
public class OrderController {

    @Autowired
    private UserClient userClient;

    @Autowired
    private OrderService orderService;

    @Autowired
    private CartService cartService;

    @Autowired
    private com.rainbowforest.orderservice.repository.UserRepository userRepository;

    @Autowired
    private HeaderGenerator headerGenerator;
    
    // Cache đơn giản để chống trùng lặp (Idempotency) - Key: CartId, Value: Timestamp
    private static final java.util.Map<String, Long> idempotencyCache = new java.util.concurrent.ConcurrentHashMap<>();
    private static final long IDEMPOTENCY_WINDOW_MS = 30000; // 30 giây

    @PostMapping(value = "/order/{userId}")
    public ResponseEntity<Order> saveOrder(
    		@PathVariable("userId") Long userId,
    		@RequestHeader(value = "Cart-Id", required = false) String cartId,
            @RequestBody(required = false) com.rainbowforest.orderservice.http.OrderRequest orderRequest,
    		HttpServletRequest request){
    	if (cartId == null) cartId = "default-cart";
        
        // --- CHỐNG TRÙNG LẶP (IDEMPOTENCY) ---
        long currentTime = System.currentTimeMillis();
        if (idempotencyCache.containsKey(cartId)) {
            long lastTime = idempotencyCache.get(cartId);
            if (currentTime - lastTime < IDEMPOTENCY_WINDOW_MS) {
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            }
        }
        idempotencyCache.put(cartId, currentTime);

        List<Item> cart = cartService.getAllItemsFromCart(cartId);
        
        // 1. Lấy thông tin user từ User-Service (Auth)
        User userFromAuth = userClient.getUserById(userId);   
        
        if(cart != null && userFromAuth != null) {
            // 2. Kiểm tra xem User này đã tồn tại trong DB cục bộ chưa
            User finalUser = userRepository.findById(userId).orElse(null);
            
            if (finalUser == null) {
                // Nếu chưa có, lưu mới vào module Order
                finalUser = userRepository.save(userFromAuth);
            } else {
                // Nếu đã có, cập nhật lại tên (đề phòng đổi tên bên Auth)
                finalUser.setUserName(userFromAuth.getUserName());
                finalUser = userRepository.save(finalUser);
            }

        	Order order = this.createOrder(cart, finalUser, orderRequest);
        	try{
                orderService.saveOrder(order);
                cartService.clearCart(cartId);
                return new ResponseEntity<Order>(
                		order, 
                		headerGenerator.getHeadersForSuccessPostMethod(request, order.getId()),
                		HttpStatus.CREATED);
            }catch (Exception ex){
                idempotencyCache.remove(cartId);
                ex.printStackTrace();
                return new ResponseEntity<Order>(
                		headerGenerator.getHeadersForError(),
                		HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
  
        return new ResponseEntity<Order>(
                headerGenerator.getHeadersForError(),
                HttpStatus.NOT_FOUND);
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return new ResponseEntity<List<Order>>(
                orders,
                headerGenerator.getHeadersForSuccessGetMethod(),
                HttpStatus.OK);
    }

    @GetMapping("/order")
    public ResponseEntity<List<Order>> getOrdersByFiltering(@RequestParam(value = "userId", required = false) Long userId) {
        System.out.println("🔍 Receiving request for orders with userId: " + userId);
        List<Order> orders;
        if (userId != null) {
            orders = orderService.getOrdersByUserId(userId);
        } else {
            // Bảo mật: Không trả về đơn hàng nếu không có userId
            orders = new java.util.ArrayList<>();
        }
        return new ResponseEntity<List<Order>>(
                orders,
                headerGenerator.getHeadersForSuccessGetMethod(),
                HttpStatus.OK);
    }

    @GetMapping({"/orders/{id}", "/order/{id}"})
    public ResponseEntity<Order> getOrderById(@PathVariable("id") Long id) {
        Order order = orderService.getOrderById(id);
        if (order != null) {
            return new ResponseEntity<Order>(
                    order,
                    headerGenerator.getHeadersForSuccessGetMethod(),
                    HttpStatus.OK);
        }
        return new ResponseEntity<Order>(
                headerGenerator.getHeadersForError(),
                HttpStatus.NOT_FOUND);
    }

    @PostMapping("/order/{id}/cancel")
    public ResponseEntity<Order> cancelOrder(@PathVariable("id") Long id, @RequestBody(required = false) java.util.Map<String, String> payload) {
        String reason = payload != null ? payload.get("cancel_reason") : "Người dùng hủy";
        Order order = orderService.cancelOrder(id, reason);
        if (order != null) {
            return new ResponseEntity<Order>(
                    order,
                    headerGenerator.getHeadersForSuccessGetMethod(),
                    HttpStatus.OK);
        }
        return new ResponseEntity<Order>(
                headerGenerator.getHeadersForError(),
                HttpStatus.NOT_FOUND);
    }

    @PutMapping({"/orders/{id}/status", "/order/{id}/status"})
    public ResponseEntity<Order> updateOrderStatus(@PathVariable("id") Long id, @RequestParam("status") String status) {
        Order order = orderService.updateOrderStatus(id, status);
        if (order != null) {
            return new ResponseEntity<Order>(
                    order,
                    headerGenerator.getHeadersForSuccessGetMethod(),
                    HttpStatus.OK);
        }
        return new ResponseEntity<Order>(
                headerGenerator.getHeadersForError(),
                HttpStatus.NOT_FOUND);
    }
    
    private Order createOrder(List<Item> cart, User user, com.rainbowforest.orderservice.http.OrderRequest orderRequest) {
        Order order = new Order();
        
        // --- LOGIC HỢP NHẤT SẢN PHẨM ---
        // Nếu trong giỏ hàng có nhiều dòng cho cùng 1 sản phẩm, chúng ta gộp lại thành 1 dòng duy nhất
        java.util.Map<Long, Item> consolidatedMap = new java.util.HashMap<>();
        for (Item item : cart) {
            Long productId = item.getProduct().getCatalogId();
            if (consolidatedMap.containsKey(productId)) {
                Item existing = consolidatedMap.get(productId);
                existing.setQuantity(existing.getQuantity() + item.getQuantity());
                existing.setSubTotal(existing.getSubTotal().add(item.getSubTotal()));
            } else {
                // Tạo một bản sao để không ảnh hưởng đến dữ liệu gốc của giỏ hàng
                Item newItem = new Item(item.getQuantity(), item.getProduct(), item.getSubTotal());
                consolidatedMap.put(productId, newItem);
            }
        }
        
        List<Item> consolidatedItems = new java.util.ArrayList<>(consolidatedMap.values());
        order.setItems(consolidatedItems);
        order.setUser(user);
        order.setTotal(OrderUtilities.countTotalPrice(consolidatedItems));
        order.setOrderedDate(LocalDateTime.now());
        order.setStatus("PAYMENT_EXPECTED");
        
        if (orderRequest != null) {
            order.setShippingAddress(orderRequest.getShippingAddress());
            order.setCustName(orderRequest.getCustName());
            order.setCustPhone(orderRequest.getCustPhone());
            order.setCustEmail(orderRequest.getCustEmail());
            order.setPaymentMethod(orderRequest.getPaymentMethod() != null ? orderRequest.getPaymentMethod() : "COD");
            order.setShipMethod(orderRequest.getShipMethod() != null ? orderRequest.getShipMethod() : "Giao hang nhanh");
            order.setCustomerNote(orderRequest.getCustomerNote());
        } else {
            // Set default shipping/customer info
            order.setShippingAddress("So 1 Dai Co Viet, Bach Khoa, Hai Ba Trung, Ha Noi");
            order.setCustName(user.getUserName());
            order.setCustPhone("0987654321");
            order.setCustEmail("guest@example.com");
            order.setPaymentMethod("COD");
            order.setShipMethod("Giao hang nhanh");
            order.setCustomerNote("Giao gio hanh chinh");
        }
        
        return order;
    }
}
