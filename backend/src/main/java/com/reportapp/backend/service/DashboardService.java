package com.reportapp.backend.service;

import com.reportapp.backend.dto.*;
import com.reportapp.backend.entity.*;
import com.reportapp.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final ReportRepository reportRepo;
    private final UserRepository userRepo;
    private final ReportService reportService;

    public List<ReportDTO> getAllReports(UUID userId, UUID projectId, LocalDate weekStart, LocalDate weekEnd) {
        return reportRepo.findAll().stream()
                .filter(r -> userId == null || r.getUser().getId().equals(userId))
                .filter(r -> projectId == null || (r.getProject() != null && r.getProject().getId().equals(projectId)))
                .filter(r -> weekStart == null || !r.getWeekStart().isBefore(weekStart))
                .filter(r -> weekEnd == null || !r.getWeekEnd().isAfter(weekEnd))
                .sorted(Comparator.comparing(r -> r.getCreatedAt() != null ? r.getCreatedAt() : LocalDateTime.MIN,
                        Comparator.reverseOrder()))
                .map(reportService::toDTO)
                .toList();
    }

    public Map<String, Object> getMetrics() {
        List<Report> allReports = reportRepo.findAll();
        LocalDate startOfWeek = LocalDate.now().with(DayOfWeek.MONDAY);

        List<Report> thisWeek = allReports.stream()
                .filter(r -> r.getWeekStart() != null && !r.getWeekStart().isBefore(startOfWeek))
                .toList();

        long submitted = thisWeek.stream().filter(r -> r.getStatus() == Report.Status.SUBMITTED).count();
        long total = thisWeek.size();
        long openBlockers = allReports.stream()
                .filter(r -> r.getBlockers() != null && !r.getBlockers().isBlank())
                .count();

        return Map.of(
                "submittedThisWeek", submitted,
                "totalThisWeek", total,
                "complianceRate", total > 0 ? Math.round((double) submitted / total * 100) : 0,
                "openBlockers", openBlockers
        );
    }

    public List<UserDTO> getAllUsers() {
        return userRepo.findAll().stream()
                .map(u -> new UserDTO(u.getId(), u.getName(), u.getEmail(), u.getRole().name()))
                .toList();
    }

    public List<ReportDTO> getRecentActivity(int limit) {
        return reportRepo.findAll().stream()
                .sorted(Comparator.comparing(r -> r.getCreatedAt() != null ? r.getCreatedAt() : LocalDateTime.MIN,
                        Comparator.reverseOrder()))
                .limit(limit)
                .map(reportService::toDTO)
                .toList();
    }
}
