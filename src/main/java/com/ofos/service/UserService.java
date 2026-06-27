package com.ofos.service;

import com.ofos.model.dto.request.UserProfileUpdateRequest;
import com.ofos.model.dto.response.UserProfileResponse;

public interface UserService {
    UserProfileResponse getProfile(Long userId);
    UserProfileResponse updateProfile(Long userId, UserProfileUpdateRequest request);
}
