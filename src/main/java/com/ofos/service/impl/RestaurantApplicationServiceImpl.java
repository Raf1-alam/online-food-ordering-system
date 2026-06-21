package com.ofos.service.impl;

import com.ofos.exception.ResourceNotFoundException;
import com.ofos.model.dto.request.ApplicationRequest;
import com.ofos.model.dto.request.RestaurantRequest;
import com.ofos.model.dto.response.ApplicationResponse;
import com.ofos.model.entity.RestaurantApplication;
import com.ofos.model.entity.User;
import com.ofos.model.enums.ApplicationStatus;
import com.ofos.model.enums.Role;
import com.ofos.repository.RestaurantApplicationRepository;
import com.ofos.repository.UserRepository;
import com.ofos.service.RestaurantApplicationService;
import com.ofos.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class RestaurantApplicationServiceImpl implements RestaurantApplicationService {

    private final RestaurantApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final RestaurantService restaurantService;

    @Override
    @Transactional
    public ApplicationResponse submitApplication(ApplicationRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Optional<RestaurantApplication> existing = applicationRepository.findByUserId(userId);
        if (existing.isPresent()) {
            throw new IllegalStateException("You already have an application submitted.");
        }

        RestaurantApplication application = RestaurantApplication.builder()
                .user(user)
                .restaurantName(request.getRestaurantName())
                .address(request.getAddress())
                .phone(request.getPhone())
                .businessLicenseUrl(request.getBusinessLicenseUrl())
                .status(ApplicationStatus.PENDING)
                .build();

        application = applicationRepository.save(application);
        log.info("New restaurant application submitted by user: {}", user.getEmail());
        return toResponse(application);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ApplicationResponse> getAllApplications(Pageable pageable) {
        return applicationRepository.findAll(pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicationResponse getMyApplication(Long userId) {
        RestaurantApplication app = applicationRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "userId", userId));
        return toResponse(app);
    }

    @Override
    @Transactional
    public ApplicationResponse approveApplication(Long applicationId, String adminNotes) {
        RestaurantApplication app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        if (app.getStatus() != ApplicationStatus.PENDING) {
            throw new IllegalStateException("Application is not in PENDING state");
        }

        app.setStatus(ApplicationStatus.APPROVED);
        app.setAdminNotes(adminNotes);

        User user = app.getUser();
        user.setRole(Role.RESTAURANT_STAFF);
        userRepository.save(user);

        RestaurantRequest restaurantRequest = RestaurantRequest.builder()
                .name(app.getRestaurantName())
                .address(app.getAddress())
                .phone(app.getPhone())
                .ownerId(user.getId())
                .build();

        restaurantService.createRestaurant(restaurantRequest);

        log.info("Application {} approved. User {} is now RESTAURANT_STAFF and restaurant created.", app.getId(), user.getEmail());
        return toResponse(applicationRepository.save(app));
    }

    @Override
    @Transactional
    public ApplicationResponse rejectApplication(Long applicationId, String adminNotes) {
        RestaurantApplication app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        if (app.getStatus() != ApplicationStatus.PENDING) {
            throw new IllegalStateException("Application is not in PENDING state");
        }

        app.setStatus(ApplicationStatus.REJECTED);
        app.setAdminNotes(adminNotes);

        log.info("Application {} rejected.", app.getId());
        return toResponse(applicationRepository.save(app));
    }

    private ApplicationResponse toResponse(RestaurantApplication app) {
        return ApplicationResponse.builder()
                .id(app.getId())
                .userId(app.getUser().getId())
                .userName(app.getUser().getFullName())
                .userEmail(app.getUser().getEmail())
                .restaurantName(app.getRestaurantName())
                .address(app.getAddress())
                .phone(app.getPhone())
                .businessLicenseUrl(app.getBusinessLicenseUrl())
                .status(app.getStatus())
                .adminNotes(app.getAdminNotes())
                .createdAt(app.getCreatedAt())
                .build();
    }
}
