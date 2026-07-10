package com.reportapp.backend.repository;


import com.reportapp.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.*;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE " +
           "(:search IS NULL OR LOWER(u.name) LIKE :search OR LOWER(u.email) LIKE :search)")
    Page<User> searchUsersWithoutRole(@Param("search") String search, Pageable pageable);

    @Query("SELECT u FROM User u WHERE " +
           "(:search IS NULL OR LOWER(u.name) LIKE :search OR LOWER(u.email) LIKE :search) " +
           "AND u.role = :role")
    Page<User> searchUsersWithRole(@Param("search") String search, @Param("role") User.Role role, Pageable pageable);
}
