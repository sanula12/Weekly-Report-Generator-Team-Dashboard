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
    public ResponseEntity<?> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "false") boolean all) {
        if (all) {
            // Support for dropdowns that need all projects
            return ResponseEntity.ok(projectService.getAllProjects());
        }
        return ResponseEntity.ok(projectService.searchProjects(search, org.springframework.data.domain.PageRequest.of(page, size)));
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
