package com.bank.banking_system.service;

import com.bank.banking_system.entity.Account;
import com.bank.banking_system.entity.AccountType;
import com.bank.banking_system.entity.Admin;
import com.bank.banking_system.entity.Branch;
import com.bank.banking_system.entity.Customer;
import com.bank.banking_system.exception.AccountNotFoundException;

import com.bank.banking_system.repository.AccountRepository;
import com.bank.banking_system.repository.AdminRepository;
import com.bank.banking_system.repository.BranchRepository;
import com.bank.banking_system.repository.CustomerRepository;
import com.bank.banking_system.repository.TransactionRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class AccountService {

    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;
    private final BranchRepository branchRepository;
    private final AdminRepository adminRepository;
    private final TransactionRepository transactionRepository;

    @jakarta.persistence.PersistenceContext
    private jakarta.persistence.EntityManager entityManager;

    public AccountService(AccountRepository accountRepository,
                          CustomerRepository customerRepository,
                          BranchRepository branchRepository,
                          AdminRepository adminRepository,
                          TransactionRepository transactionRepository) {

        this.accountRepository = accountRepository;
        this.customerRepository = customerRepository;
        this.branchRepository = branchRepository;
        this.adminRepository = adminRepository;
        this.transactionRepository = transactionRepository;
    }

    // ===== OPEN ACCOUNT =====
    public Account openAccount(Long customerId,
                               Long branchId,
                               Long adminId,
                               String accountNumber,
                               AccountType type,
                               BigDecimal balance) {

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new RuntimeException("Branch not found"));

        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        Account account = new Account();
        account.setAccountNumber(accountNumber);
        account.setAccountType(type);
        account.setBalance(balance);
        account.setCustomer(customer);
        account.setBranch(branch);
        account.setAdmin(admin);
        account.setOpenedDate(LocalDate.now());
        account.setStatus("ACTIVE");

        return accountRepository.save(account);
    }

    // ===== GET ALL ACCOUNTS =====
    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    // ===== GET ACCOUNT BY ID =====
    public Account getAccountById(Integer accountId) {
        return accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
    }

    // ===== GET BALANCE =====
    public BigDecimal getBalance(Integer accountId) {

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        return account.getBalance();
    }

    // ===== UPDATE ACCOUNT =====
    public Account updateAccount(Integer accountId, AccountType type, BigDecimal balance, String status) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (type != null) account.setAccountType(type);
        if (balance != null) account.setBalance(balance);
        if (status != null) account.setStatus(status);

        return accountRepository.save(account);
    }

    // ===== DELETE ACCOUNT =====
    public void deleteAccount(Integer accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // 1) Delete JPA-managed transactions on current schema (table: transaction, fk: account_id)
        transactionRepository.deleteByAccount_AccountId(accountId);

        // 2) Best-effort cleanup for legacy schemas (table: transactions with from_account_id/to_account_id)
        try {
            entityManager.createNativeQuery("DELETE FROM transactions WHERE from_account_id = :id OR to_account_id = :id")
                    .setParameter("id", accountId)
                    .executeUpdate();
        } catch (Exception ignored) { /* table/columns may not exist in this env */ }

        // 3) Delete the account itself
        accountRepository.delete(account);
    }

    // ===== GET ACCOUNTS BY CUSTOMER ID =====
    public List<Account> getAccountsByCustomerId(Long customerId) {
        return accountRepository.findByCustomer_CustomerId(customerId);
    }

    // ===== GET ACCOUNT BY ACCOUNT NUMBER =====
    public Account getAccountByNumber(String accountNumber) {
        // Try exact match first, then case-insensitive
        Account account = accountRepository.findByAccountNumber(accountNumber);
        if (account == null) {
            account = accountRepository.findByAccountNumberIgnoreCase(accountNumber);
        }
        if (account == null) {
            throw new AccountNotFoundException("Account not found with number: " + accountNumber);
        }
        return account;
    }
}



