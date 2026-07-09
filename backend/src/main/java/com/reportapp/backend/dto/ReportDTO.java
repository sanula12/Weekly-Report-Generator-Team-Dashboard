package com.reportapp.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record ReportDTO(
        UUID id,
        UserDTO user,
        ProjectDTO project,
        LocalDate weekStart,
        LocalDate weekEnd,
        String tasksCompleted,
        String tasksPlanned,
        String blockers,
        Integer hoursWorked,
        String notes,
        String status,
        LocalDateTime submittedAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
