package com.person.b2b.service;

import com.person.b2b.dto.AdminStatsResponse;
import com.person.b2b.entity.RoleUtilisateur;
import com.person.b2b.entity.StatutProduit;
import com.person.b2b.repository.CategorieProduitRepository;
import com.person.b2b.repository.ProduitRepository;
import com.person.b2b.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AdminService {

    private final UserRepository userRepository;
    private final ProduitRepository produitRepository;
    private final CategorieProduitRepository categorieRepository;

    public AdminService(
            UserRepository userRepository,
            ProduitRepository produitRepository,
            CategorieProduitRepository categorieRepository) {
        this.userRepository = userRepository;
        this.produitRepository = produitRepository;
        this.categorieRepository = categorieRepository;
    }

    public AdminStatsResponse getStats() {
        return new AdminStatsResponse(
                userRepository.count(),
                userRepository.countByRole(RoleUtilisateur.VENDEUR),
                userRepository.countByRole(RoleUtilisateur.ADMIN),
                produitRepository.count(),
                produitRepository.sumViews(),
                produitRepository.countByStatut(StatutProduit.DISPONIBLE),
                produitRepository.countByStatut(StatutProduit.RESERVE),
                produitRepository.countByStatut(StatutProduit.INDISPONIBLE),
                produitRepository.countByMisEnAvantTrue(),
                categorieRepository.count());
    }
}
