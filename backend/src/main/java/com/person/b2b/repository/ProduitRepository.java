package com.person.b2b.repository;

import com.person.b2b.entity.Produit;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProduitRepository extends JpaRepository<Produit, Long> {

    List<Produit> findByVendeurIdOrderByDatePublicationDesc(Long vendeurId);

    List<Produit> findByCategorieId(Long categorieId);

    List<Produit> findByMisEnAvantTrueOrderByDatePublicationDesc();
}
