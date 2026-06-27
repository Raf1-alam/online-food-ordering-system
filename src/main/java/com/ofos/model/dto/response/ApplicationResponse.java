package com.ofos.model.dto.response;

import com.ofos.model.enums.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private String restaurantName;
    private String address;
    private String phone;
    private String businessLicenseUrl;
    private String restaurantImageUrl;
    private ApplicationStatus status;
    private String adminNotes;
    private LocalDateTime createdAt;
}
