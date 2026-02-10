package com.bank.banking_system.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDto {

    private Long customerId;
    private String name;
    private String email;
    private String phone;
    private String address;
    private LocalDate createdDate;
}



