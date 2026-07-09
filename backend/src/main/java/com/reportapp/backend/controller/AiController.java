package com.reportapp.backend.controller;

import com.reportapp.backend.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/chat")
    public ResponseEntity<?> chat(Authentication auth, @RequestBody ChatRequest req) {
        String email = auth.getName();
        String role = auth.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .orElse("MEMBER");
        String response = aiService.chat(req.message(), email, role);
        return ResponseEntity.ok(new ChatResponse(response));
    }

    record ChatRequest(String message) {}
    record ChatResponse(String response) {}
}
