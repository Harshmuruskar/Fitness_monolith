package com.project.fitness.service;


import com.project.fitness.dto.ActivityRequest;
import com.project.fitness.dto.ActivityResponse;
import com.project.fitness.model.Activity;
import com.project.fitness.model.User;
import com.project.fitness.repository.ActivityRepository;
import com.project.fitness.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;

    public ActivityResponse trackActivity(ActivityRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getUserId()));

        Activity activity = Activity.builder()
                                .user(user)
                        .type(request.getType())
                                .duration(request.getDuration())
                                        .CaloriesBurned(request.getCaloriesBurned())
                                                .startTime(request.getStartTime())
                                                        .additionalMatrics(request.getAdditionalMatrics()).build();

        Activity savedActivity  = activityRepository.save(activity);
        return mapToResponse(savedActivity);
    }

    private ActivityResponse mapToResponse(Activity savedActivity) {
        ActivityResponse response = new ActivityResponse();
        response.setId(savedActivity.getId());
        response.setUserId(savedActivity.getUser().getId());
        response.setType(savedActivity.getType());
        response.setDuration(savedActivity.getDuration());
        response.setCaloriesBurned(savedActivity.getCaloriesBurned());
        response.setStartTime(savedActivity.getStartTime());
        response.setAdditionalMatrics(savedActivity.getAdditionalMatrics());
        response.setCreatedAt(savedActivity.getCreatedAt());
        response.setUpdatedAt(savedActivity.getUpdatedAt());
        return response;
    }

    public List<ActivityResponse> getUserActivities(String userId) {
        List<Activity> activities = activityRepository.findByUserId(userId);
        return activities.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
}
