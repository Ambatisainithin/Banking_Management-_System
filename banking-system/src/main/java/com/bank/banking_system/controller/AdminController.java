package com.bank.banking_system.controller;

import com.bank.banking_system.entity.*;
import com.bank.banking_system.service.AccountService;
import com.bank.banking_system.service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AccountService accountService;
    private final CustomerService customerService;

    public AdminController(AccountService accountService, CustomerService customerService) {
        this.accountService = accountService;
        this.customerService = customerService;
    }

    // ===== CUSTOMER MANAGEMENT =====

    @PostMapping("/customer")
    public ResponseEntity<?> createCustomer(@RequestBody CustomerRequest request) {
        try {
            Customer customer = customerService.createCustomer(
                request.getName(),
                request.getEmail(),
                request.getPhone(),
                request.getAddress(),
                request.getPassword()
            );
            return ResponseEntity.ok(customer);
        } catch (Exception e) {
            Map<String, Object> error = new java.util.HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Inner class for customer request
    public static class CustomerRequest {
        private String name;
        private String email;
        private String phone;
        private String address;
        private String password;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    @DeleteMapping("/customer/{id}")
    public String deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return "Customer deleted successfully";
    }

    // OPEN ACCOUNT
    @PostMapping("/open-account")
    public Account openAccount(
            @RequestParam Long customerId,
            @RequestParam Long branchId,
            @RequestParam Long adminId,
            @RequestParam String accountNumber,
            @RequestParam AccountType type,
            @RequestParam BigDecimal balance) {

        return accountService.openAccount(
                customerId,
                branchId,
                adminId,
                accountNumber,
                type,
                balance);
    }

    // GET ALL ACCOUNTS
    @GetMapping("/accounts")
    public List<Account> getAllAccounts() {
        return accountService.getAllAccounts();
    }

    // GET ACCOUNT BY ID
    @GetMapping("/account/{id}")
    public Account getAccountById(@PathVariable Integer id) {
        return accountService.getAccountById(id);
    }

    // UPDATE ACCOUNT
    @PutMapping("/account/{id}")
    public Account updateAccount(
            @PathVariable Integer id,
            @RequestParam(required = false) AccountType type,
            @RequestParam(required = false) BigDecimal balance,
            @RequestParam(required = false) String status) {
        return accountService.updateAccount(id, type, balance, status);
    }

    // DELETE ACCOUNT
    @DeleteMapping("/account/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable Integer id) {
        accountService.deleteAccount(id);
        Map<String, Object> response = new java.util.HashMap<>();
        response.put("success", true);
        response.put("message", "Account deleted successfully");
        return ResponseEntity.ok(response);
    }
}



