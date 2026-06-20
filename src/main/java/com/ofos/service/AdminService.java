package com.ofos.service;

import com.ofos.model.dto.request.RoleUpdateRequest;
import com.ofos.model.dto.response.TransactionResponse;
import com.ofos.model.dto.response.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminService {

    Page<UserResponse> getAllUsers(Pageable pageable);

    UserResponse updateUserRole(Long userId, RoleUpdateRequest request);

    void toggleUserStatus(Long userId);

    Page<TransactionResponse> getAllTransactions(Pageable pageable);
}
