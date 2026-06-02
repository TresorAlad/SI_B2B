package com.person.b2b.dto;

import com.person.b2b.entity.CategorieProduit;

public record CategorieProduitResponse(Long id, String nom) {

    public static CategorieProduitResponse from(CategorieProduit categorie) {
        return new CategorieProduitResponse(categorie.getId(), categorie.getNom());
    }
}
