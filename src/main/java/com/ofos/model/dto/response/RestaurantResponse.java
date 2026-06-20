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
public class RestaurantResponse {

    private Long id;
    private String name;
    private String description;
    private String address;
    private String phone;
    private Long ownerId;
    private String ownerName;
    private boolean active;
    private int menuItemCount;
    private LocalDateTime createdAt;
}
