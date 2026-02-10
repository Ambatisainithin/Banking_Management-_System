package com.bank.banking_system.service;

import com.bank.banking_system.entity.*;
import com.bank.banking_system.repository.*;

import com.bank.banking_system.exception.AccountNotFoundException;
import com.bank.banking_system.exception.InsufficientBalanceException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
public class TransactionService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public TransactionService(AccountRepository accountRepository,
                              TransactionRepository transactionRepository) {

        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    // ===== DEPOSIT =====
    public Transaction deposit(Integer accountId, BigDecimal amount) {

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() ->
                        new AccountNotFoundException("Account not found"));

        account.setBalance(account.getBalance().add(amount));

        Transaction tx = new Transaction();
        tx.setAmount(amount);
        tx.setTransactionType(TransactionType.DEPOSIT);
        tx.setStatus("SUCCESS");
        tx.setAccount(account);

        accountRepository.save(account);
        return transactionRepository.save(tx);
    }

    // ===== WITHDRAW =====
    public Transaction withdraw(Integer accountId, BigDecimal amount) {

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() ->
                        new AccountNotFoundException("Account not found"));

        if (account.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException("Insufficient balance");
        }

        account.setBalance(account.getBalance().subtract(amount));

        Transaction tx = new Transaction();
        tx.setAmount(amount);
        tx.setTransactionType(TransactionType.WITHDRAWAL);
        tx.setStatus("SUCCESS");
        tx.setAccount(account);

        accountRepository.save(account);
        return transactionRepository.save(tx);
    }

    // ===== TRANSACTION HISTORY =====
    public List<Transaction> getTransactionsByAccount(Integer accountId) {

        return transactionRepository.findByAccount_AccountId(accountId);
    }

    // ===== TRANSFER =====
    public void transfer(Integer fromId, Integer toId, BigDecimal amount) {

        Account from = accountRepository.findById(fromId)
                .orElseThrow(() ->
                        new AccountNotFoundException("Sender account not found"));

        Account to = accountRepository.findById(toId)
                .orElseThrow(() ->
                        new AccountNotFoundException("Receiver account not found"));

        if (from.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException("Insufficient balance");
        }

        from.setBalance(from.getBalance().subtract(amount));
        to.setBalance(to.getBalance().add(amount));

        Transaction debit = new Transaction();
        debit.setAmount(amount);
        debit.setTransactionType(TransactionType.TRANSFER);
        debit.setStatus("SUCCESS");
        debit.setAccount(from);

        Transaction credit = new Transaction();
        credit.setAmount(amount);
        credit.setTransactionType(TransactionType.TRANSFER);
        credit.setStatus("SUCCESS");
        credit.setAccount(to);

        accountRepository.save(from);
        accountRepository.save(to);

        transactionRepository.save(debit);
        transactionRepository.save(credit);
    }
}



