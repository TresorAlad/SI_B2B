package com.person.b2b.dto;

import com.person.b2b.entity.Produit;
import com.person.b2b.entity.StatutProduit;
import java.time.LocalDate;

public record ProduitSummaryResponse(
        Long id,
        String name,
        String description,
        Long price,
        int views,
        StatutProduit statut,
        boolean nouveau,
        String whatsapp,
        LocalDate datePublication,
        String brand,
        boolean misEnAvant,
        Long categorieId,
        String categorieNom,
        Long vendeurId,
        String vendeurName) {

    public static ProduitSummaryResponse from(Produit produit) {
        return new ProduitSummaryResponse(
                produit.getId(),
                produit.getName(),
                produit.getDescription(),
                produit.getPrice(),
                produit.getViews(),
                produit.getStatut(),
                produit.isNouveau(),
                produit.getWhatsapp(),
                produit.getDatePublication(),
                produit.getBrand(),
                produit.isMisEnAvant(),
                produit.getCategorie().getId(),
                produit.getCategorie().getNom(),
                produit.getVendeur().getId(),
                produit.getVendeur().getName());
    }
}
