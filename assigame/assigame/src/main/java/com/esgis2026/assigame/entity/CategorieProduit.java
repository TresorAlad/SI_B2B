package com.esgis2026.assigame.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Objects;

@Entity
@Getter
@Setter
@Table(name = "categorieproduit")
public class CategorieProduit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idcategorie_produit;

    @Column(unique = true, nullable = false, length = 40)
    private String nom_categorieproduit;

    @Column(length = 100)
    private String description;

    @Override
    public String toString() {
        return "CategorieProduit{" +
                "idcategorie_produit=" + idcategorie_produit +
                ", nom_categorieproduit='" + nom_categorieproduit + '\'' +
                ", description='" + description + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        CategorieProduit that = (CategorieProduit) o;
        return Objects.equals(idcategorie_produit, that.idcategorie_produit);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(idcategorie_produit);
    }
}

