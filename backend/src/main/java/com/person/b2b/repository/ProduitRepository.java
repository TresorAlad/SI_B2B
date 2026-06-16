package com.person.b2b.repository;

import com.person.b2b.entity.Produit;
import com.person.b2b.entity.StatutProduit;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProduitRepository extends JpaRepository<Produit, Long> {

    @EntityGraph(attributePaths = {"categorie", "vendeur"})
    @Override
    List<Produit> findAll();

    @EntityGraph(attributePaths = {"categorie", "vendeur"})
    List<Produit> findByVendeurIdOrderByDatePublicationDesc(Long vendeurId);

    @EntityGraph(attributePaths = {"categorie", "vendeur"})
    List<Produit> findByMisEnAvantTrueOrderByDatePublicationDesc();

    List<Produit> findByCategorieId(Long categorieId);

    @EntityGraph(attributePaths = {"categorie", "vendeur"})
    Optional<Produit> findWithRelationsById(Long id);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Produit p SET p.views = p.views + 1 WHERE p.id = :id")
    int incrementViews(@Param("id") Long id);

    long countByStatut(StatutProduit statut);

    long countByMisEnAvantTrue();

    @Query("SELECT COALESCE(SUM(p.views), 0) FROM Produit p")
    long sumViews();
}
