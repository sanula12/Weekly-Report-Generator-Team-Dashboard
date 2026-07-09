package com.reportapp.backend.controller;



import com.reportapp.backend.entity.User;
import com.reportapp.backend.repository.UserRepository;
import com.reportapp.backend.security.JwtUtil;
import lombok.*;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (userRepo.existsByEmail(req.email())) {
            return ResponseEntity.badRequest().body("Email already in use");
        }
        var user = User.builder()
                .name(req.name())
                .email(req.email())
                .password(encoder.encode(req.password()))
                .role(req.role() != null ? req.role() : User.Role.MEMBER)
                .build();
        userRepo.save(user);
        String token = jwtUtil.generate(user.getEmail(), user.getRole().name());
        return ResponseEntity.ok(new AuthResponse(token, user.getRole().name(), user.getName()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        var user = userRepo.findByEmail(req.email())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!encoder.matches(req.password(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
        String token = jwtUtil.generate(user.getEmail(), user.getRole().name());
        return ResponseEntity.ok(new AuthResponse(token, user.getRole().name(), user.getName()));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(org.springframework.security.core.Authentication auth) {
        var user = userRepo.findByEmail(auth.getName()).orElseThrow();
        return ResponseEntity.ok(new AuthResponse(null, user.getRole().name(), user.getName()));
    }

    record RegisterRequest(String name, String email, String password, User.Role role) {}
    record LoginRequest(String email, String password) {}
    record AuthResponse(String token, String role, String name) {}
}
