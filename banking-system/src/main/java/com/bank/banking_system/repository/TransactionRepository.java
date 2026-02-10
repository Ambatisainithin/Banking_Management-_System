package com.bank.banking_system.repository;

import com.bank.banking_system.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByAccount_AccountId(Integer accountId);
    
    void deleteByAccount_AccountId(Integer accountId);
}

