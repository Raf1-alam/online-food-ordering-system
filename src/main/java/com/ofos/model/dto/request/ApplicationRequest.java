package com.ofos.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationRequest {

    @NotBlank(message = "Restaurant name is required")
    @Size(max = 150, message = "Name must not exceed 150 characters")
    private String restaurantName;

    @NotBlank(message = "Address is required")
    @Size(max = 300, message = "Address must not exceed 300 characters")
    private String address;

    @NotBlank(message = "Phone is required")
    @Size(max = 20, message = "Phone must not exceed 20 characters")
    private String phone;

    @Size(max = 500, message = "License URL must not exceed 500 characters")
    private String businessLicenseUrl;

    @Size(max = 500, message = "Restaurant Image URL must not exceed 500 characters")
    private String restaurantImageUrl;
}
