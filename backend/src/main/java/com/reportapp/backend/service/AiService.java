package com.reportapp.backend.service;

import com.reportapp.backend.entity.Report;
import com.reportapp.backend.entity.User;
import com.reportapp.backend.repository.ReportRepository;
import com.reportapp.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AiService {

    @Value("${app.openai.api-key:}")
    private String openAiApiKey;

    private final ReportRepository reportRepo;
    private final UserRepository userRepo;

    public String chat(String message, String userEmail, String role) {
        if (openAiApiKey == null || openAiApiKey.isBlank()) {
            return "\u26a0\ufe0f AI Assistant is not configured. Please set the OPENAI_API_KEY environment variable on the backend server.";
        }

        String context = buildContext(userEmail, role);
        String systemPrompt = buildSystemPrompt(context, role);

        var requestBody = Map.of(
                "model", "gpt-4o-mini",
                "messages", List.of(
                        Map.of("role", "system", "content", systemPrompt),
                        Map.of("role", "user", "content", message)
                ),
                "max_tokens", 800,
                "temperature", 0.7
        );

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = RestClient.create()
                    .post()
                    .uri("https://api.openai.com/v1/chat/completions")
                    .header("Authorization", "Bearer " + openAiApiKey)
                    .header("Content-Type", "application/json")
                    .body(requestBody)
                    .retrieve()
                    .body(Map.class);

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            @SuppressWarnings("unchecked")
            Map<String, Object> messageObj = (Map<String, Object>) choices.get(0).get("message");
            return (String) messageObj.get("content");
        } catch (Exception e) {
            return "I encountered an error processing your request. Please try again. Error: " + e.getMessage();
        }
    }

    private String buildContext(String userEmail, String role) {
        List<Report> reports;
        if ("MANAGER".equals(role)) {
            reports = reportRepo.findAll().stream()
                    .sorted(Comparator.comparing(r -> r.getCreatedAt() != null ? r.getCreatedAt() : LocalDateTime.MIN,
                            Comparator.reverseOrder()))
                    .limit(50)
                    .toList();
        } else {
            User user = userRepo.findByEmail(userEmail).orElseThrow();
            reports = reportRepo.findByUser(user).stream().limit(20).toList();
        }

        var ctx = new StringBuilder("Team work reports (most recent first):\n\n");
        for (Report r : reports) {
            ctx.append(String.format(
                    "Member: %s | Week: %s to %s | Project: %s | Status: %s%n" +
                    "  Tasks Completed: %s%n  Tasks Planned: %s%n  Blockers: %s%n  Hours: %s%n%n",
                    r.getUser().getName(),
                    r.getWeekStart(), r.getWeekEnd(),
                    r.getProject() != null ? r.getProject().getName() : "General",
                    r.getStatus(),
                    r.getTasksCompleted(),
                    r.getTasksPlanned(),
                    r.getBlockers() != null && !r.getBlockers().isBlank() ? r.getBlockers() : "None",
                    r.getHoursWorked() != null ? r.getHoursWorked() + "h" : "Not specified"
            ));
        }
        return ctx.toString();
    }

    private String buildSystemPrompt(String context, String role) {
        String roleDesc = "MANAGER".equals(role)
                ? "a team manager who needs insights about their team's work and productivity"
                : "a team member reviewing their own work history";
        return "You are an intelligent AI assistant for a team work reporting system. " +
               "You are helping " + roleDesc + ". " +
               "Use the following report data to answer questions accurately:\n\n" +
               context +
               "\nGuidelines:\n" +
               "- Reference specific report data when answering\n" +
               "- Identify patterns, blockers, and workload imbalances\n" +
               "- Be concise but thorough\n" +
               "- Format responses clearly with bullet points where appropriate\n" +
               "- If asked about something not in the data, state that clearly";
    }
}
