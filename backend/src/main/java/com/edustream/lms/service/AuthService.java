package com.edustream.lms.service;

import com.edustream.lms.config.JwtUtil;
import com.edustream.lms.dto.AuthRequest;
import com.edustream.lms.dto.AuthResponse;
import com.edustream.lms.dto.SignupRequest;
import com.edustream.lms.model.Role;
import com.edustream.lms.model.User;
import com.edustream.lms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered: " + request.getEmail());
        }

        Role userRole = Role.STUDENT;
        if (request.getRole() != null && request.getRole().equalsIgnoreCase("INSTRUCTOR")) {
            userRole = Role.INSTRUCTOR;
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .displayName(request.getDisplayName() != null ? request.getDisplayName() : request.getEmail().split("@")[0])
                .role(userRole)
                .avatarUrl("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150")
                .build();

        User saved = userRepository.save(user);
        String token = jwtUtil.generateToken(saved.getEmail(), saved.getId(), saved.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .id(saved.getId())
                .email(saved.getEmail())
                .displayName(saved.getDisplayName())
                .role(saved.getRole())
                .avatarUrl(saved.getAvatarUrl())
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .role(user.getRole())
                .avatarUrl(user.getAvatarUrl())
                .build();
    }
}
