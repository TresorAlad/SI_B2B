package com.person.b2b.repository;

import com.person.b2b.entity.CategorieProduit;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategorieProduitRepository extends JpaRepository<CategorieProduit, Long> {

    Optional<CategorieProduit> findByNom(String nom);

    boolean existsByNom(String nom);
}
