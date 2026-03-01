package com.shopping.mall.auth;

import com.shopping.mall.user.Role;
import com.shopping.mall.user.User;
import com.shopping.mall.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/signup")
    public AuthResponse signup(@RequestBody SignupRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new IllegalArgumentException("Email already exists");
        }

        Role role = req.role() == null ? Role.USER : Role.valueOf(req.role());
        User u = userRepository.save(User.builder()
                .email(req.email())
                .passwordHash(passwordEncoder.encode(req.password()))
                .role(role)
                .build());

        String token = jwtUtil.createToken(u.getId(), u.getRole().name());
        return new AuthResponse(token, u.getId(), u.getRole().name());
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest req) {
        User u = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (!passwordEncoder.matches(req.password(), u.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        String token = jwtUtil.createToken(u.getId(), u.getRole().name());
        return new AuthResponse(token, u.getId(), u.getRole().name());
    }
}
