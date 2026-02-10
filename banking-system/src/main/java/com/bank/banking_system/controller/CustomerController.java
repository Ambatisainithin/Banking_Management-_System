package com.bank.banking_system.controller;

import com.bank.banking_system.entity.Account;
import com.bank.banking_system.entity.Customer;
import com.bank.banking_system.entity.Transaction;
import com.bank.banking_system.service.AccountService;
import com.bank.banking_system.service.CustomerService;
import com.bank.banking_system.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    private final TransactionService transactionService;
    private final AccountService accountService;
    private final CustomerService customerService;

    public CustomerController(TransactionService transactionService,
                              AccountService accountService,
                              CustomerService customerService) {
        this.transactionService = transactionService;
        this.accountService = accountService;
        this.customerService = customerService;
    }

    // ===== GET ALL CUSTOMERS =====
    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    // ===== GET CUSTOMER BY ID =====
    @GetMapping("/{id}")
    public Customer getCustomerById(@PathVariable Long id) {
        return customerService.getCustomerById(id);
    }

    // ===== DEPOSIT =====
    @PostMapping("/deposit")
    public Transaction deposit(@RequestParam Integer accountId,
                               @RequestParam BigDecimal amount) {
        return transactionService.deposit(accountId, amount);
    }

    // ===== WITHDRAW =====
    @PostMapping("/withdraw")
    public Transaction withdraw(@RequestParam Integer accountId,
                                @RequestParam BigDecimal amount) {
        return transactionService.withdraw(accountId, amount);
    }

    // ===== TRANSACTIONS =====
    @GetMapping("/transactions/{accountId}")
    public List<Transaction> getTransactions(@PathVariable Integer accountId) {
        return transactionService.getTransactionsByAccount(accountId);
    }

    // ===== TRANSFER =====
    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(@RequestParam Integer fromAccountId,
                            @RequestParam Integer toAccountId,
                            @RequestParam BigDecimal amount) {
        transactionService.transfer(fromAccountId, toAccountId, amount);
        Map<String, Object> response = new java.util.HashMap<>();
        response.put("success", true);
        response.put("message", "Transfer successful");
        response.put("fromAccountId", fromAccountId);
        response.put("toAccountId", toAccountId);
        response.put("amount", amount);
        return ResponseEntity.ok(response);
    }

    // ===== GET ACCOUNT =====
    @GetMapping("/account/{accountId}")
    public Account getAccount(@PathVariable Integer accountId) {
        return accountService.getAccountById(accountId);
    }

    // ===== BALANCE =====
    @GetMapping("/balance/{accountId}")
    public BigDecimal getBalance(@PathVariable Integer accountId) {
        return accountService.getBalance(accountId);
    }

    // ===== GET ACCOUNTS BY CUSTOMER ID =====
    @GetMapping("/accounts/{customerId}")
    public List<Account> getAccountsByCustomerId(@PathVariable Long customerId) {
        return accountService.getAccountsByCustomerId(customerId);
    }

    // ===== GET ACCOUNT BY ACCOUNT NUMBER =====
    @GetMapping("/account-by-number/{accountNumber}")
    public Account getAccountByNumber(@PathVariable String accountNumber) {
        return accountService.getAccountByNumber(accountNumber);
    }
}




