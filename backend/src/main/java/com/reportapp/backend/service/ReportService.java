package com.reportapp.backend.service;

import com.reportapp.backend.dto.*;
import com.reportapp.backend.entity.*;
import com.reportapp.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportService {

    private final ReportRepository reportRepo;
    private final UserRepository userRepo;
    private final ProjectRepository projectRepo;

    public ReportDTO toDTO(Report report) {
        UserDTO userDTO = new UserDTO(
                report.getUser().getId(),
                report.getUser().getName(),
                report.getUser().getEmail(),
                report.getUser().getRole().name()
        );
        ProjectDTO projectDTO = report.getProject() != null
                ? new ProjectDTO(report.getProject().getId(), report.getProject().getName(), report.getProject().getDescription())
                : null;
        return new ReportDTO(
                report.getId(), userDTO, projectDTO,
                report.getWeekStart(), report.getWeekEnd(),
                report.getTasksCompleted(), report.getTasksPlanned(),
                report.getBlockers(), report.getHoursWorked(), report.getNotes(),
                report.getStatus().name(), report.getSubmittedAt(),
                report.getCreatedAt(), report.getUpdatedAt()
        );
    }

    public List<ReportDTO> getMyReports(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        return reportRepo.findByUserOrderByWeekStartDesc(user).stream().map(this::toDTO).toList();
    }

    @Transactional
    public ReportDTO createReport(String email, ReportRequest req) {
        User user = userRepo.findByEmail(email).orElseThrow();
        var report = Report.builder()
                .user(user)
                .weekStart(req.weekStart())
                .weekEnd(req.weekEnd())
                .tasksCompleted(req.tasksCompleted())
                .tasksPlanned(req.tasksPlanned())
                .blockers(req.blockers())
                .hoursWorked(req.hoursWorked())
                .notes(req.notes())
                .status(Report.Status.DRAFT)
                .build();
        if (req.projectId() != null) {
            projectRepo.findById(req.projectId()).ifPresent(report::setProject);
        }
        return toDTO(reportRepo.save(report));
    }

    @Transactional
    public ReportDTO updateReport(UUID id, String email, ReportRequest req) {
        User user = userRepo.findByEmail(email).orElseThrow();
        var report = reportRepo.findById(id).orElseThrow();
        if (!report.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Forbidden");
        }
        report.setTasksCompleted(req.tasksCompleted());
        report.setTasksPlanned(req.tasksPlanned());
        report.setBlockers(req.blockers());
        report.setHoursWorked(req.hoursWorked());
        report.setNotes(req.notes());
        report.setWeekStart(req.weekStart());
        report.setWeekEnd(req.weekEnd());
        if (req.projectId() != null) {
            projectRepo.findById(req.projectId()).ifPresent(report::setProject);
        } else {
            report.setProject(null);
        }
        return toDTO(reportRepo.save(report));
    }

    @Transactional
    public ReportDTO submitReport(UUID id, String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        var report = reportRepo.findById(id).orElseThrow();
        if (!report.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Forbidden");
        }
        report.setStatus(Report.Status.SUBMITTED);
        report.setSubmittedAt(LocalDateTime.now());
        return toDTO(reportRepo.save(report));
    }

    @Transactional
    public void deleteReport(UUID id, String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        var report = reportRepo.findById(id).orElseThrow();
        if (!report.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Forbidden");
        }
        reportRepo.delete(report);
    }

    public record ReportRequest(
            LocalDate weekStart,
            LocalDate weekEnd,
            String tasksCompleted,
            String tasksPlanned,
            String blockers,
            Integer hoursWorked,
            String notes,
            UUID projectId
    ) {}
}
