package com.reportapp.backend.service;

import com.reportapp.backend.dto.ProjectDTO;
import com.reportapp.backend.entity.Project;
import com.reportapp.backend.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectService {

    private final ProjectRepository projectRepo;

    public ProjectDTO toDTO(Project project) {
        return new ProjectDTO(project.getId(), project.getName(), project.getDescription());
    }

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
        projectRepo.deleteById(id);
    }
}
