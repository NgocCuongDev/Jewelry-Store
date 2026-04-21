package com.rainbowforest.orderservice.controller;

import com.rainbowforest.orderservice.http.header.HeaderGenerator;
import com.rainbowforest.orderservice.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import jakarta.servlet.http.HttpServletRequest;

@RestController
public class CartController {

    @Autowired
    CartService cartService;
    
    @Autowired
    private HeaderGenerator headerGenerator;

    @GetMapping (value = "/cart")
    public ResponseEntity<List<Object>> getCart(@RequestHeader(value = "Cart-Id", required = false) String cartId){
        if (cartId == null) cartId = "default-cart";
        List<Object> cart = cartService.getCart(cartId);
        if(!cart.isEmpty()) {
        	return new ResponseEntity<List<Object>>(
        			cart,
        			headerGenerator.getHeadersForSuccessGetMethod(),
        			HttpStatus.OK);
        }
    	return new ResponseEntity<List<Object>>(
    			headerGenerator.getHeadersForError(),
    			HttpStatus.NOT_FOUND);  
    }

    @PostMapping(value = "/cart", params = {"productId", "quantity"})
    public ResponseEntity<List<Object>> addItemToCart(
            @RequestParam("productId") Long productId,
            @RequestParam("quantity") Integer quantity,
            @RequestHeader(value = "Cart-Id", required = false) String cartId,
            HttpServletRequest request) {
        if (cartId == null) cartId = "default-cart";
        List<Object> cart = cartService.getCart(cartId);
        if(cart != null) {
        	try {
                if(cart.isEmpty()){
                    cartService.addItemToCart(cartId, productId, quantity);
                }else{
                    if(cartService.checkIfItemIsExist(cartId, productId)){
                        cartService.changeItemQuantity(cartId, productId, quantity);
                    }else {
                        cartService.addItemToCart(cartId, productId, quantity);
                    }
                }
            } catch (org.springframework.dao.DataIntegrityViolationException e) {
                // Ignore the duplicate insert from parallel request race conditions
            }
            // Re-fetch updated cart content
            cart = cartService.getCart(cartId);
        	return new ResponseEntity<List<Object>>(
        			cart,
        			headerGenerator.getHeadersForSuccessPostMethod(request, productId),
        			HttpStatus.CREATED);
        }
        return new ResponseEntity<List<Object>>(
        		headerGenerator.getHeadersForError(),
        		HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping(value = "/cart", params = "productId")
    public ResponseEntity<List<Object>> removeItemFromCart(
            @RequestParam("productId") Long productId,
            @RequestHeader(value = "Cart-Id", required = false) String cartId){
        if (cartId == null) cartId = "default-cart";
    	List<Object> cart = cartService.getCart(cartId);
    	if(cart != null) {
    		cartService.deleteItemFromCart(cartId, productId);
            // Sau khi xóa, lấy lại danh sách giỏ hàng mới nhất để trả về cho Frontend
            List<Object> updatedCart = cartService.getCart(cartId);
            return new ResponseEntity<List<Object>>(
                    updatedCart,
            		headerGenerator.getHeadersForSuccessGetMethod(),
            		HttpStatus.OK);
    	}
        return new ResponseEntity<List<Object>>(
        		headerGenerator.getHeadersForError(),
        		HttpStatus.NOT_FOUND);
    }
}
