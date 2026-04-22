package com.rainbowforest.userservice.service;

import com.rainbowforest.userservice.entity.User;
import com.rainbowforest.userservice.entity.UserRole;
import com.rainbowforest.userservice.repository.UserRepository;
import com.rainbowforest.userservice.repository.UserRoleRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public User getUserByName(String userName) {
        return userRepository.findByUserName(userName);
    }

    @Override
    public User saveUser(User user) {
        user.setActive(1);
        UserRole role = userRoleRepository.findUserRoleByRoleName("USER");
        user.setRole(role);
        
        // Hash the password before saving
        String hashedPassword = BCrypt.hashpw(user.getUserPassword(), BCrypt.gensalt());
        user.setUserPassword(hashedPassword);
        
        return userRepository.save(user);
    }

    @Override
    public User updateUser(Long id, User user) {
        User existingUser = userRepository.findById(id).orElse(null);
        if (existingUser != null) {
            existingUser.setUserName(user.getUserName());
            existingUser.setActive(user.getActive());
            
            // Update password if provided
            if (user.getUserPassword() != null && !user.getUserPassword().isEmpty()) {
                String hashedPassword = BCrypt.hashpw(user.getUserPassword(), BCrypt.gensalt());
                existingUser.setUserPassword(hashedPassword);
            }
            
            // Update UserDetails
            if (user.getUserDetails() != null) {
                if (existingUser.getUserDetails() == null) {
                    existingUser.setUserDetails(user.getUserDetails());
                } else {
                    existingUser.getUserDetails().setFirstName(user.getUserDetails().getFirstName());
                    existingUser.getUserDetails().setLastName(user.getUserDetails().getLastName());
                    existingUser.getUserDetails().setEmail(user.getUserDetails().getEmail());
                    existingUser.getUserDetails().setPhoneNumber(user.getUserDetails().getPhoneNumber());
                    existingUser.getUserDetails().setStreet(user.getUserDetails().getStreet());
                    existingUser.getUserDetails().setStreetNumber(user.getUserDetails().getStreetNumber());
                    existingUser.getUserDetails().setZipCode(user.getUserDetails().getZipCode());
                    existingUser.getUserDetails().setLocality(user.getUserDetails().getLocality());
                    existingUser.getUserDetails().setCountry(user.getUserDetails().getCountry());
                    existingUser.getUserDetails().setImage(user.getUserDetails().getImage());
                }
            }
            
            // Update Role if provided
            if (user.getRole() != null && user.getRole().getRoleName() != null) {
                UserRole role = userRoleRepository.findUserRoleByRoleName(user.getRole().getRoleName());
                if (role != null) {
                    existingUser.setRole(role);
                }
            }
            
            return userRepository.save(existingUser);
        }
        return null;
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public User authenticateUser(String identity, String password) {
        System.out.println("DEBUG: Authenticating user with identity: " + identity);
        
        // Try finding by username first
        User user = userRepository.findByUserName(identity);
        
        // If not found, try finding by email
        if (user == null) {
            System.out.println("DEBUG: User not found by username, searching by email...");
            user = userRepository.findByUserDetailsEmail(identity);
        }
        
        if (user != null) {
            System.out.println("DEBUG: User found: " + user.getUserName());
            boolean matches = BCrypt.checkpw(password, user.getUserPassword());
            System.out.println("DEBUG: Password match: " + matches);
            if (matches) {
                return user;
            } else {
                System.out.println("DEBUG: Password mismatch for user: " + identity);
            }
        } else {
            System.out.println("DEBUG: User not found by identity: " + identity);
        }
        return null;
    }

    @Override
    public User forgotPassword(String email) {
        User user = userRepository.findByUserDetailsEmail(email);
        if (user != null) {
            String code = String.format("%06d", new Random().nextInt(1000000));
            user.setResetCode(code);
            user.setResetCodeExpiry(LocalDateTime.now().plusMinutes(10));
            return userRepository.save(user);
        }
        return null;
    }

    @Override
    public boolean verifyResetCode(String email, String code) {
        User user = userRepository.findByUserDetailsEmail(email);
        return user != null && 
               code != null &&
               code.equals(user.getResetCode()) && 
               user.getResetCodeExpiry() != null &&
               user.getResetCodeExpiry().isAfter(LocalDateTime.now());
    }

    @Override
    public boolean resetPassword(String email, String code, String newPassword) {
        if (verifyResetCode(email, code)) {
            User user = userRepository.findByUserDetailsEmail(email);
            if (user != null) {
                String hashedPassword = BCrypt.hashpw(newPassword, BCrypt.gensalt());
                user.setUserPassword(hashedPassword);
                user.setResetCode(null);
                user.setResetCodeExpiry(null);
                userRepository.save(user);
                return true;
            }
        }
        return false;
    }
}
