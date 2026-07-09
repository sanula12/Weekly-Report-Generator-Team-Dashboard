package com.reportapp.backend.controller;

import com.reportapp.backend.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<?> list() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @PostMapping
    public ResponseEntity<?> create(Authentication auth, @RequestBody ProjectRequest req) {
        if (!isManager(auth)) return ResponseEntity.status(403).body("Managers only");
        return ResponseEntity.ok(projectService.createProject(req.name(), req.description()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(Authentication auth, @PathVariable UUID id, @RequestBody ProjectRequest req) {
        if (!isManager(auth)) return ResponseEntity.status(403).body("Managers only");
        return ResponseEntity.ok(projectService.updateProject(id, req.name(), req.description()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(Authentication auth, @PathVariable UUID id) {
        if (!isManager(auth)) return ResponseEntity.status(403).body("Managers only");
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    private boolean isManager(Authentication auth) {
        return auth != null && auth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_MANAGER"));
    }

    record ProjectRequest(String name, String description) {}
}
