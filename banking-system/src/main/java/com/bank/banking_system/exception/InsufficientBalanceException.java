package com.bank.banking_system.exception;

public class InsufficientBalanceException extends RuntimeException {
	public InsufficientBalanceException(String message) {
		super(message);
	}

}
