package com.reportapp.backend.repository;

import com.reportapp.backend.entity.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {
    @Query("SELECT p FROM Project p WHERE :search IS NULL OR LOWER(p.name) LIKE :search")
    Page<Project> searchProjects(@Param("search") String search, Pageable pageable);
}