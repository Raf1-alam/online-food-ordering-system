package com.ofos.service;

import com.ofos.model.dto.request.ApplicationRequest;
import com.ofos.model.dto.response.ApplicationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RestaurantApplicationService {
    ApplicationResponse submitApplication(ApplicationRequest request, Long userId);
    Page<ApplicationResponse> getAllApplications(Pageable pageable);
    ApplicationResponse getMyApplication(Long userId);
    ApplicationResponse approveApplication(Long applicationId, String adminNotes);
    ApplicationResponse rejectApplication(Long applicationId, String adminNotes);
}
