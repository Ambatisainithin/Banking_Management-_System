package com.bank.banking_system.service;

import com.bank.banking_system.entity.Customer;
import com.bank.banking_system.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final AccountService accountService;

    public CustomerService(CustomerRepository customerRepository,
                           AccountService accountService) {
        this.customerRepository = customerRepository;
        this.accountService = accountService;
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer createCustomer(String name, String email, String phone, String address, String password) {
        Customer customer = new Customer();
        customer.setName(name);
        customer.setEmail(email);
        customer.setPhone(phone);
        customer.setAddress(address);
        customer.setPassword(password);
        customer.setCreatedDate(LocalDate.now());
        return customerRepository.save(customer);
    }

    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    public void deleteCustomer(Long id) {
        Customer customer = getCustomerById(id);

        // Delete all accounts (and their transactions) for this customer first
        if (customer.getAccounts() != null) {
            for (var acc : customer.getAccounts()) {
                if (acc != null && acc.getAccountId() != null) {
                    accountService.deleteAccount(acc.getAccountId());
                }
            }
        }

        // Now delete the customer record
        customerRepository.delete(customer);
    }
}



