package com.reportapp.backend.controller;

import com.reportapp.backend.dto.UserDTO;
import com.reportapp.backend.entity.User;
import com.reportapp.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<Page<UserDTO>> list(
            Authentication auth,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role) {
        if (!isManager(auth)) return ResponseEntity.status(403).build();
        User.Role roleEnum = null;
        if (role != null && !role.isBlank()) {
            try { roleEnum = User.Role.valueOf(role.toUpperCase()); } catch (Exception ignored) {}
        }
        return ResponseEntity.ok(userService.searchUsers(search, roleEnum, PageRequest.of(page, size)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(Authentication auth, @PathVariable UUID id, @RequestBody UserUpdateRequest req) {
        if (!isManager(auth)) return ResponseEntity.status(403).body("Managers only");
        return ResponseEntity.ok(userService.updateUser(id, req.name(), req.email(), req.role()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(Authentication auth, @PathVariable UUID id) {
        if (!isManager(auth)) return ResponseEntity.status(403).body("Managers only");
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    private boolean isManager(Authentication auth) {
        return auth != null && auth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_MANAGER"));
    }

    public record UserUpdateRequest(String name, String email, String role) {}
}
