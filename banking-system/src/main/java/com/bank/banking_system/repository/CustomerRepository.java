package com.bank.banking_system.repository;

import com.bank.banking_system.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByCustomerIdAndPassword(Long customerId, String password);
}



