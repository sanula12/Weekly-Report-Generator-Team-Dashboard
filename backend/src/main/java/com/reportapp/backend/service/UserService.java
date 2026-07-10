package com.reportapp.backend.service;

import com.reportapp.backend.dto.UserDTO;
import com.reportapp.backend.entity.Report;
import com.reportapp.backend.entity.User;
import com.reportapp.backend.repository.ReportRepository;
import com.reportapp.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final ReportRepository reportRepository;

    public Page<UserDTO> searchUsers(String search, User.Role role, Pageable pageable) {
        String query = (search != null && !search.isBlank()) ? "%" + search.toLowerCase() + "%" : null;
        Page<User> usersPage;
        if (role == null) {
            usersPage = userRepository.searchUsersWithoutRole(query, pageable);
        } else {
            usersPage = userRepository.searchUsersWithRole(query, role, pageable);
        }
        return usersPage.map(u -> new UserDTO(u.getId(), u.getName(), u.getEmail(), u.getRole().name()));
    }

    @Transactional
    public UserDTO updateUser(UUID id, String name, String email, String roleStr) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setName(name);
        user.setEmail(email);
        if (roleStr != null) {
            user.setRole(User.Role.valueOf(roleStr));
        }
        user = userRepository.save(user);
        return new UserDTO(user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }

    @Transactional
    public void deleteUser(UUID id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        // First delete all reports related to this user to maintain integrity
        List<Report> reports = reportRepository.findByUserOrderByWeekStartDesc(user);
        reportRepository.deleteAll(reports);
        
        userRepository.delete(user);
    }
}
