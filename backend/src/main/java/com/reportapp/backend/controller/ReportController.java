package com.reportapp.backend.controller;

import com.reportapp.backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping
    public ResponseEntity<?> getMyReports(Authentication auth) {
        return ResponseEntity.ok(reportService.getMyReports(auth.getName()));
    }

    @PostMapping
    public ResponseEntity<?> create(Authentication auth, @RequestBody ReportService.ReportRequest req) {
        return ResponseEntity.ok(reportService.createReport(auth.getName(), req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(Authentication auth, @PathVariable UUID id,
                                    @RequestBody ReportService.ReportRequest req) {
        try {
            return ResponseEntity.ok(reportService.updateReport(id, auth.getName(), req));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @PatchMapping("/{id}/submit")
    public ResponseEntity<?> submit(Authentication auth, @PathVariable UUID id) {
        try {
            return ResponseEntity.ok(reportService.submitReport(id, auth.getName()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(Authentication auth, @PathVariable UUID id) {
        try {
            reportService.deleteReport(id, auth.getName());
            return ResponseEntity.ok().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}
