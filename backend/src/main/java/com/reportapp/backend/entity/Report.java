package com.reportapp.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reports")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    private LocalDate weekStart;
    private LocalDate weekEnd;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String tasksCompleted;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String tasksPlanned;

    private String blockers;
    private Integer hoursWorked;
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "report_status")
    private Status status = Status.DRAFT;

    private LocalDateTime submittedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public enum Status { DRAFT, SUBMITTED, LATE }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
