package com.ofos.service.impl;

import com.ofos.exception.LastAdminException;
import com.ofos.exception.ResourceNotFoundException;
import com.ofos.model.dto.request.RoleUpdateRequest;
import com.ofos.model.dto.response.TransactionResponse;
import com.ofos.model.dto.response.UserResponse;
import com.ofos.model.entity.Payment;
import com.ofos.model.entity.User;
import com.ofos.model.enums.Role;
import com.ofos.repository.PaymentRepository;
import com.ofos.repository.RefreshTokenRepository;
import com.ofos.repository.UserRepository;
import com.ofos.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Admin service for system-wide management.
 * Includes protection logic to prevent removing the last admin.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::toUserResponse);
    }

    @Override
    @Transactional
    public UserResponse updateUserRole(Long userId, RoleUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Prevent demoting the last admin
        if (user.getRole() == Role.ADMIN && request.getRole() != Role.ADMIN) {
            checkLastAdmin();
        }

        user.setRole(request.getRole());
        user = userRepository.save(user);

        // Revoke all existing tokens to force re-login with new role
        refreshTokenRepository.revokeAllByUserId(user.getId());

        log.info("User {} role updated to {}", user.getEmail(), user.getRole());
        return toUserResponse(user);
    }

    @Override
    @Transactional
    public void toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Prevent deactivating the last admin
        if (user.getRole() == Role.ADMIN && user.isActive()) {
            checkLastAdmin();
        }

        user.setActive(!user.isActive());
        userRepository.save(user);

        // If deactivated, revoke all tokens
        if (!user.isActive()) {
            refreshTokenRepository.revokeAllByUserId(user.getId());
        }

        log.info("User {} active status toggled to {}", user.getEmail(), user.isActive());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TransactionResponse> getAllTransactions(Pageable pageable) {
        return paymentRepository.findAll(pageable).map(this::toTransactionResponse);
    }

    // ==================== Helpers ====================

    private void checkLastAdmin() {
        long adminCount = userRepository.countByRoleAndActiveTrue(Role.ADMIN);
        if (adminCount <= 1) {
            throw new LastAdminException();
        }
    }

    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private TransactionResponse toTransactionResponse(Payment payment) {
        return TransactionResponse.builder()
                .paymentId(payment.getId())
                .orderId(payment.getOrder().getId())
                .customerName(payment.getOrder().getUser().getFullName())
                .customerEmail(payment.getOrder().getUser().getEmail())
                .restaurantName(payment.getOrder().getRestaurant().getName())
                .amount(payment.getAmount())
                .paymentMethod(payment.getMethod())
                .paymentStatus(payment.getStatus())
                .transactionRef(payment.getTransactionRef())
                .paidAt(payment.getPaidAt())
                .build();
    }
}
