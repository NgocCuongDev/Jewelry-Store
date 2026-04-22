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

import com.rainbowforest.userservice.service.EmailService;
import java.util.Map;

@RestController
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailService emailService;

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

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null) return ResponseEntity.badRequest().body("Email is required");

        User user = userService.forgotPassword(email);
        if (user != null) {
            try {
                emailService.sendResetCode(email, user.getResetCode());
                return ResponseEntity.ok("Mã xác nhận đã được gửi tới email của bạn.");
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi khi gửi email xác nhận.");
            }
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email không tồn tại trong hệ thống.");
    }

    @PostMapping("/verify-reset-code")
    public ResponseEntity<?> verifyResetCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");
        
        if (userService.verifyResetCode(email, code)) {
            return ResponseEntity.ok("Mã xác thực chính xác.");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Mã xác thực không hợp lệ hoặc đã hết hạn.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");
        String newPassword = request.get("newPassword");

        if (userService.resetPassword(email, code, newPassword)) {
            return ResponseEntity.ok("Mật khẩu đã được thay đổi thành công.");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Không thể đổi mật khẩu. Vui lòng kiểm tra lại mã xác nhận.");
    }
}
