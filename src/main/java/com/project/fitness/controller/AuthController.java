package com.project.fitness.controller;

import com.project.fitness.dto.LoginRequest;
import com.project.fitness.dto.LoginResponse;
import com.project.fitness.dto.RegisterRequest;
import com.project.fitness.dto.UserResponse;
import com.project.fitness.model.User;
import com.project.fitness.repository.UserRepository;
import com.project.fitness.security.JwtUtils;
import com.project.fitness.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest registerRequest){
        return ResponseEntity.ok(userService.register(registerRequest));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        try {
            User user = userService.authenticate(loginRequest);
            System.out.println("User authenticated: " + user.getEmail());
            System.out.println("User role: " + user.getRole());
            String token = jwtUtils.generateToken(user.getId(), user.getRole().name());
            return ResponseEntity.ok(new LoginResponse(
                    token, userService.mapToResponse(user)
            ));

        } catch (AuthenticationException e) {
            e.printStackTrace();
            return ResponseEntity.status(401).build();
        }
    }
}
