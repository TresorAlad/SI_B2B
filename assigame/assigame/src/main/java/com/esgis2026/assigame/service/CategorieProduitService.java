package com.esgis2026.assigame.service;

import org.springframework.stereotype.Service;
import java.util.List;
import com.esgis2026.assigame.entity.CategorieProduit;
import com.esgis2026.assigame.repository.CategorieProduitRepository;

@Service
public class CategorieProduitService {
    final CategorieProduitRepository categorieProduitRepository;

    public CategorieProduitService(CategorieProduitRepository categorieProduitRepository) {
        this.categorieProduitRepository = categorieProduitRepository;
    }
    public List<CategorieProduit> getAllCategorieProduits() {
        return categorieProduitRepository.findAll();
    }

    public CategorieProduit createCategorieProduit(CategorieProduit categorieProduit) {
        return categorieProduitRepository.save(categorieProduit);
    }

    public void deleteCategorieProduit(Long idCategorieProduit) {
        categorieProduitRepository.deleteById(idCategorieProduit);
    }

    public CategorieProduit updateCategorieProduit(Long idCategorieProduit, CategorieProduit details) {
        CategorieProduit categorieProduit = categorieProduitRepository.findById(idCategorieProduit)
                .orElseThrow(()-> new
                                RuntimeException("categorieProduit not found with id " + idCategorieProduit));
                categorieProduit.setNom_categorieproduit(details.getNom_categorieproduit());
                categorieProduit.setDescription(details.getDescription());
                return categorieProduitRepository.save(categorieProduit);

    }
}
    