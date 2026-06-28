package com.ofos.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAddressResponse {
    private Long id;
    private String label;
    private String fullAddress;
    private boolean isDefault;
    private LocalDateTime createdAt;
}
