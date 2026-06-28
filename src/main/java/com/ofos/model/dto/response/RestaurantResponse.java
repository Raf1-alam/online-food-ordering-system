package com.ofos.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonProperty;

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
    private String imageUrl;
    private String openingTime;
    private String closingTime;
    @JsonProperty("isCurrentlyOpen")
    private boolean isCurrentlyOpen;
    private Double rating;
    private Long ownerId;
    private String ownerName;
    private boolean active;
    private int menuItemCount;
    private LocalDateTime createdAt;
}
