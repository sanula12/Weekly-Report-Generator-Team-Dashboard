package com.reportapp.backend.dto;

import java.util.UUID;

public record UserDTO(UUID id, String name, String email, String role) {}
