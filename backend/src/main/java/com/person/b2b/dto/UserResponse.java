package com.person.b2b.dto;

import com.person.b2b.entity.User;

public record UserResponse(Long id, String name, String email, String whatsapp) {

    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getWhatsapp());
    }
}
