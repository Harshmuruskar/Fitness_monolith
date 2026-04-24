package com.project.fitness.service;

import com.project.fitness.dto.LoginRequest;
import com.project.fitness.dto.RegisterRequest;
import com.project.fitness.dto.UserResponse;
import com.project.fitness.model.User;
import com.project.fitness.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponse register(RegisterRequest request) {
        User user = User.builder()
                .email(request.getEmail())
                .firstname(request.getFirstName())
                .lastname(request.getLastName())
                .role(request.getRole())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();


        User SavedUser = userRepository.save(user);
        return mapToResponse(SavedUser);
    }

    public UserResponse mapToResponse(User savedUser) {
        UserResponse userResponse = new UserResponse();
        userResponse.setId(savedUser.getId());
        userResponse.setEmail(savedUser.getEmail());
        userResponse.setFirstName(savedUser.getFirstname());
        userResponse.setLastName(savedUser.getLastname());
        userResponse.setCreatedAt(savedUser.getCreatedAt());
        userResponse.setUpdatedAt(savedUser.getUpdatedAt());
        System.out.println("name :" + userResponse.getFirstName());
        return userResponse;
    }

    public User authenticate(LoginRequest loginRequest) {
        System.out.println("Authenticating user with email: " + loginRequest.getEmail());
        User user = userRepository.findByEmail(loginRequest.getEmail());
        System.out.println("User found: " + (user != null ? user.getEmail() : "null"));
        if (user == null)
            throw new RuntimeException("Invalid Credentials");


        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid Credentials");
        }
        return user;
    }
}
