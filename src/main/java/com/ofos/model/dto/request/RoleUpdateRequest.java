package com.ofos.model.dto.request;

import com.ofos.model.enums.Role;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoleUpdateRequest {

    @NotNull(message = "Role is required")
    private Role role;
}
