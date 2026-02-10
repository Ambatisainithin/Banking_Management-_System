package com.bank.banking_system.repository;

import com.bank.banking_system.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountRepository
        extends JpaRepository<Account, Integer> {
    
    List<Account> findByCustomer_CustomerId(Long customerId);
    
    Account findByAccountNumber(String accountNumber);
    
    Account findByAccountNumberIgnoreCase(String accountNumber);
}



