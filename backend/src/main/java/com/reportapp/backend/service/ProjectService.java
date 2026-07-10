package com.reportapp.backend.service;

import com.reportapp.backend.dto.ProjectDTO;
import com.reportapp.backend.entity.Project;
import com.reportapp.backend.entity.Report;
import com.reportapp.backend.repository.ProjectRepository;
import com.reportapp.backend.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectService {

    private final ProjectRepository projectRepo;
    private final ReportRepository reportRepo;

    public ProjectDTO toDTO(Project project) {
        return new ProjectDTO(project.getId(), project.getName(), project.getDescription());
    }

    public Page<ProjectDTO> searchProjects(String search, Pageable pageable) {
        String query = (search != null && !search.isBlank()) ? "%" + search.toLowerCase() + "%" : null;
        return projectRepo.searchProjects(query, pageable).map(this::toDTO);
    }

    // Keep this for backwards compatibility if needed elsewhere
    public List<ProjectDTO> getAllProjects() {
        return projectRepo.findAll().stream().map(this::toDTO).toList();
    }

    @Transactional
    public ProjectDTO createProject(String name, String description) {
        var project = Project.builder().name(name).description(description).build();
        return toDTO(projectRepo.save(project));
    }

    @Transactional
    public ProjectDTO updateProject(UUID id, String name, String description) {
        var project = projectRepo.findById(id).orElseThrow();
        project.setName(name);
        project.setDescription(description);
        return toDTO(projectRepo.save(project));
    }

    @Transactional
    public void deleteProject(UUID id) {
        Project project = projectRepo.findById(id).orElseThrow();
        // Safe deletion: remove project reference from all reports first
        List<Report> reports = reportRepo.findAll().stream()
                .filter(r -> r.getProject() != null && r.getProject().getId().equals(id))
                .toList();
        for (Report r : reports) {
            r.setProject(null);
        }
        reportRepo.saveAll(reports);
        
        projectRepo.deleteById(id);
    }
}
