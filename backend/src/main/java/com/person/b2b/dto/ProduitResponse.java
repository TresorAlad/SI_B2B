package com.person.b2b.dto;

import com.person.b2b.entity.Produit;
import com.person.b2b.entity.StatutProduit;
import java.time.LocalDate;
import java.util.Base64;

public record ProduitResponse(
        Long id,
        String name,
        String description,
        Long price,
        int views,
        StatutProduit statut,
        boolean nouveau,
        String whatsapp,
        String image,
        LocalDate datePublication,
        String brand,
        boolean misEnAvant,
        Long categorieId,
        String categorieNom,
        Long vendeurId,
        String vendeurName) {

    public static ProduitResponse from(Produit produit) {
        String imageBase64 = produit.getImage() != null
                ? Base64.getEncoder().encodeToString(produit.getImage())
                : null;

        return new ProduitResponse(
                produit.getId(),
                produit.getName(),
                produit.getDescription(),
                produit.getPrice(),
                produit.getViews(),
                produit.getStatut(),
                produit.isNouveau(),
                produit.getWhatsapp(),
                imageBase64,
                produit.getDatePublication(),
                produit.getBrand(),
                produit.isMisEnAvant(),
                produit.getCategorie().getId(),
                produit.getCategorie().getNom(),
                produit.getVendeur().getId(),
                produit.getVendeur().getName());
    }
}
