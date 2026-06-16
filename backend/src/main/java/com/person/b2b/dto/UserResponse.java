package com.person.b2b.dto;

import com.person.b2b.entity.RoleUtilisateur;
import com.person.b2b.entity.Sexe;
import com.person.b2b.entity.User;

public record UserResponse(
        Long id,
        String name,
        String email,
        Sexe sexe,
        String paysCode,
        String telephone,
        String whatsapp,
        RoleUtilisateur role) {

    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getSexe(),
                user.getPaysCode(),
                user.getTelephone(),
                user.getWhatsapp(),
                user.getRole());
    }
}
