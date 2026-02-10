package com.bank.banking_system.exception;

public class AccountNotFoundException extends RuntimeException {
	public AccountNotFoundException(String message) {
		super(message);
	}

}
