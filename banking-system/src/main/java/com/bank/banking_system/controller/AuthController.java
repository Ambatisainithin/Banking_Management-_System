package com.bank.banking_system.controller;

import com.bank.banking_system.entity.Admin;
import com.bank.banking_system.entity.Customer;
import com.bank.banking_system.repository.AdminRepository;
import com.bank.banking_system.repository.CustomerRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final CustomerRepository customerRepository;
    private final AdminRepository adminRepository;

    // Email domain for the bank
    private static final String BANK_DOMAIN = "@bestbank.com";
    
    // Default admin credentials
    private static final String DEFAULT_ADMIN_EMAIL = "admin@bestbank.com";
    private static final String DEFAULT_ADMIN_PASSWORD = "admin123";

    public AuthController(CustomerRepository customerRepository, AdminRepository adminRepository) {
        this.customerRepository = customerRepository;
        this.adminRepository = adminRepository;
    }

    // Extract ID from email format (e.g., "1@bestbank.com" -> 1, "admin@bestbank.com" -> "admin")
    private String extractIdFromEmail(String email) {
        if (email == null || !email.toLowerCase().endsWith(BANK_DOMAIN.toLowerCase())) {
            return null;
        }
        return email.substring(0, email.toLowerCase().indexOf(BANK_DOMAIN.toLowerCase()));
    }

    // Customer Login - expects email like "1@bestbank.com"
    @PostMapping("/customer/login")
    public ResponseEntity<?> customerLogin(@RequestParam String email, @RequestParam String password) {
        Map<String, Object> response = new HashMap<>();
        
        // Validate email format
        String idPart = extractIdFromEmail(email);
        if (idPart == null) {
            response.put("success", false);
            response.put("message", "Invalid email format. Use: customerid@bestbank.com");
            return ResponseEntity.status(401).body(response);
        }

        // Parse customer ID
        Long customerId;
        try {
            customerId = Long.parseLong(idPart);
        } catch (NumberFormatException e) {
            response.put("success", false);
            response.put("message", "Invalid customer ID. Use format: 1@bestbank.com");
            return ResponseEntity.status(401).body(response);
        }

        // First check if customer exists
        Optional<Customer> existingCustomer = customerRepository.findById(customerId);
        
        if (existingCustomer.isPresent()) {
            // Customer exists - now check password
            Optional<Customer> customer = customerRepository.findByCustomerIdAndPassword(customerId, password);
            if (customer.isPresent()) {
                response.put("success", true);
                response.put("message", "Login successful");
                response.put("userType", "CUSTOMER");
                response.put("userId", customer.get().getCustomerId());
                response.put("name", customer.get().getName());
                response.put("email", customerId + BANK_DOMAIN);
                return ResponseEntity.ok(response);
            } else {
                // Customer exists but wrong password
                response.put("success", false);
                response.put("message", "Invalid password. Please try again.");
                return ResponseEntity.status(401).body(response);
            }
        } else {
            // Customer doesn't exist - check if using "admin" as email prefix
            if (idPart.equalsIgnoreCase("admin")) {
                response.put("success", false);
                response.put("message", "This is an admin account. Please use Admin Login.");
                response.put("wrongLoginType", true);
                return ResponseEntity.status(401).body(response);
            }
            response.put("success", false);
            response.put("message", "Customer not found. Please check your email.");
            return ResponseEntity.status(401).body(response);
        }
    }

    // Admin Login - expects email like "admin@bestbank.com"
    @PostMapping("/admin/login")
    public ResponseEntity<?> adminLogin(@RequestParam String email, @RequestParam String password) {
        Map<String, Object> response = new HashMap<>();
        
        // Validate email format
        String idPart = extractIdFromEmail(email);
        if (idPart == null) {
            response.put("success", false);
            response.put("message", "Invalid email format. Use: admin@bestbank.com");
            return ResponseEntity.status(401).body(response);
        }

        // Check for default admin credentials
        if (email.equalsIgnoreCase(DEFAULT_ADMIN_EMAIL) && password.equals(DEFAULT_ADMIN_PASSWORD)) {
            response.put("success", true);
            response.put("message", "Login successful");
            response.put("userType", "ADMIN");
            response.put("userId", 1L);
            response.put("name", "Administrator");
            response.put("email", DEFAULT_ADMIN_EMAIL);
            return ResponseEntity.ok(response);
        }

        // Try to parse as numeric admin ID for database admins
        try {
            Long adminId = Long.parseLong(idPart);
            Optional<Admin> admin = adminRepository.findByAdminIdAndPassword(adminId, password);
            
            if (admin.isPresent()) {
                response.put("success", true);
                response.put("message", "Login successful");
                response.put("userType", "ADMIN");
                response.put("userId", admin.get().getAdminId());
                response.put("name", admin.get().getName());
                response.put("email", adminId + BANK_DOMAIN);
                return ResponseEntity.ok(response);
            }
        } catch (NumberFormatException e) {
            // Not a numeric ID, already checked default admin above
        }

        // Check if this might be a customer trying to use admin login
        try {
            Long possibleCustomerId = Long.parseLong(idPart);
            Optional<Customer> existingCustomer = customerRepository.findById(possibleCustomerId);
            if (existingCustomer.isPresent()) {
                response.put("success", false);
                response.put("message", "This is a customer account. Please use Customer Login.");
                response.put("wrongLoginType", true);
                return ResponseEntity.status(401).body(response);
            }
        } catch (NumberFormatException e) {
            // Not a numeric ID
        }
        
        response.put("success", false);
        response.put("message", "Invalid admin credentials. Please try again.");
        return ResponseEntity.status(401).body(response);
    }
}
