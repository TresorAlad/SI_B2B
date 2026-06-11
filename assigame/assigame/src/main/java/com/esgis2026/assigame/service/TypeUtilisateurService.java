package com.esgis2026.assigame.service;

import com.esgis2026.assigame.entity.TypeUtilisateur;
import com.esgis2026.assigame.repository.TypeUtilisateurRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TypeUtilisateurService {
    final TypeUtilisateurRepository typeUtilisateurRepository;

    public TypeUtilisateurService(TypeUtilisateurRepository typeUtilisateurRepository) {
        this.typeUtilisateurRepository = typeUtilisateurRepository;
    }

    public List<TypeUtilisateur> getAllTypeUtilisateur(){
        return typeUtilisateurRepository.findAll();
    }

    public TypeUtilisateur createTypeUtilisateur(TypeUtilisateur typeUtilisateur){
        return typeUtilisateurRepository.save(typeUtilisateur);
    }

    public void deleteTypeUtilisateur(Long id){
        typeUtilisateurRepository.deleteById(id);
    }

    public TypeUtilisateur updateTypeUtilisateur(TypeUtilisateur details, Long id){
        TypeUtilisateur typeUtilisateur = typeUtilisateurRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Le typeUtilisateur n'existe pas"));
        typeUtilisateur.setLibelle_type_utilisateur(details.getLibelle_type_utilisateur());
        typeUtilisateur.setDescription_type_utilisateur(details.getDescription_type_utilisateur());

        return typeUtilisateurRepository.save(typeUtilisateur);
    }
}
