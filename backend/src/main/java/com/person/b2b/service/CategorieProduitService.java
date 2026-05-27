package com.person.b2b.service;

import com.person.b2b.entity.CategorieProduit;
import com.person.b2b.exception.EntityNotFoundException;
import com.person.b2b.repository.CategorieProduitRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CategorieProduitService {

    private final CategorieProduitRepository categorieProduitRepository;

    public CategorieProduitService(CategorieProduitRepository categorieProduitRepository) {
        this.categorieProduitRepository = categorieProduitRepository;
    }

    @Transactional(readOnly = true)
    public List<CategorieProduit> findAll() {
        return categorieProduitRepository.findAll();
    }

    @Transactional(readOnly = true)
    public CategorieProduit findById(Long id) {
        return categorieProduitRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Catégorie introuvable : " + id));
    }

    @Transactional(readOnly = true)
    public CategorieProduit findByNom(String nom) {
        return categorieProduitRepository.findByNom(nom)
                .orElseThrow(() -> new EntityNotFoundException("Catégorie introuvable : " + nom));
    }

    public CategorieProduit findOrCreateByNom(String nom) {
        return categorieProduitRepository.findByNom(nom)
                .orElseGet(() -> {
                    CategorieProduit categorie = new CategorieProduit();
                    categorie.setNom(nom);
                    return categorieProduitRepository.save(categorie);
                });
    }
}
