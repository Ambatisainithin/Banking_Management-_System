package com.bank.banking_system.repository;

import com.bank.banking_system.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByAdminIdAndPassword(Long adminId, String password);
}
