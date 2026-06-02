package com.person.b2b.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "produits")
@Getter
@Setter
@NoArgsConstructor
public class Produit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Long price;

    @Column(nullable = false)
    private int views = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatutProduit statut = StatutProduit.DISPONIBLE;

    @Column(nullable = false)
    private boolean nouveau = true;

    @Column(nullable = false, length = 20)
    private String whatsapp;

    @Column(nullable = false, columnDefinition = "bytea")
    private byte[] image;

    @Column(nullable = false)
    private LocalDate datePublication;

    @Column(nullable = false, length = 100)
    private String brand;

    @Column(nullable = false)
    private boolean misEnAvant = false;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "categorie_id", nullable = false)
    private CategorieProduit categorie;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vendeur_id", nullable = false)
    private User vendeur;

    @ManyToMany(mappedBy = "favoris")
    private Set<User> favorisPar = new HashSet<>();
}
