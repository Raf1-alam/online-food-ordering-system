package com.ofos.repository;

import com.ofos.model.entity.User;
import com.ofos.model.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for User entity.
 * DIP: Controllers/Services depend on this interface, not a concrete implementation.
 * Spring Data JPA auto-generates the implementation at runtime.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    long countByRoleAndActiveTrue(Role role);
}
