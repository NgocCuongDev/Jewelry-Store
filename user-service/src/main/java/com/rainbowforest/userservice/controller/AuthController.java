package com.rainbowforest.userservice.controller;

import com.rainbowforest.userservice.dto.LoginRequest;
import com.rainbowforest.userservice.dto.LoginResponse;
import com.rainbowforest.userservice.entity.User;
import com.rainbowforest.userservice.service.UserService;
import com.rainbowforest.userservice.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        if (loginRequest == null || loginRequest.getUserName() == null || loginRequest.getPassword() == null) {
            return ResponseEntity.badRequest().body("Username and password are required");
        }
        
        User user = userService.authenticateUser(loginRequest.getUserName(), loginRequest.getPassword());
        
        if (user != null) {
            String token = jwtUtil.generateToken(user.getUserName());
            String userImage = user.getUserDetails() != null ? user.getUserDetails().getImage() : null;
            return ResponseEntity.ok(new LoginResponse(token, user.getId(), user.getUserName(), userImage));
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
    }
}
