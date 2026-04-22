package com.rainbowforest.userservice.controller;

import com.rainbowforest.userservice.entity.User;
import com.rainbowforest.userservice.repository.UserRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DebugController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/debug/reset-password")
    public String resetPassword(@RequestParam String email, @RequestParam String newPassword) {
        User user = userRepository.findByUserDetailsEmail(email);
        if (user != null) {
            String hashed = BCrypt.hashpw(newPassword, BCrypt.gensalt());
            user.setUserPassword(hashed);
            userRepository.save(user);
            return "Password reset successful for " + email + " (Pass: " + newPassword + ", Hash: " + hashed + ")";
        }
        return "User not found with email: " + email;
    }
}
