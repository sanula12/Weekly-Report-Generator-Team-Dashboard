package com.reportapp.backend.repository;

import com.reportapp.backend.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.*;

public interface ReportRepository extends JpaRepository<Report, UUID> {
    List<Report> findByUser(User user);
    List<Report> findByUserOrderByWeekStartDesc(User user);
    List<Report> findByWeekStartBetween(LocalDate from, LocalDate to);
    List<Report> findByUserAndWeekStart(User user, LocalDate weekStart);
}