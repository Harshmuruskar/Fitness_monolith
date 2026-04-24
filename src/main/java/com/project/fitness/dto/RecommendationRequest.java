package com.project.fitness.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationRequest {
    private String userId;
    private String activityId;
    public List<String > improvements;
    public List<String > suggestions;
    public List<String > safety;
}
