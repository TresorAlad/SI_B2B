package com.esgis2026.assigame.controller;

import com.esgis2026.assigame.entity.TypeUtilisateur;
import com.esgis2026.assigame.service.TypeUtilisateurService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/typeutilisateur")
public class TypeUtilisateurController {
    final TypeUtilisateurService typeUtilisateurService;

    public TypeUtilisateurController(TypeUtilisateurService typeUtilisateurService) {
        this.typeUtilisateurService = typeUtilisateurService;
    }

    @GetMapping
    public List<TypeUtilisateur> getTypeUtilisateur() {
        return typeUtilisateurService.getAllTypeUtilisateur();
    }

    @PostMapping("/add")
    public TypeUtilisateur createTypeUtilisateur(@RequestBody TypeUtilisateur typeUtilisateur) {
        return typeUtilisateurService.createTypeUtilisateur(typeUtilisateur);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteTypeUtilisateur(@PathVariable Long id) {
        typeUtilisateurService.deleteTypeUtilisateur(id);
    }

    @PutMapping("/update/{id}")
    public TypeUtilisateur updateTypeUtilisateur(@PathVariable Long id, @RequestBody TypeUtilisateur typeUtilisateur) {
        return typeUtilisateurService.updateTypeUtilisateur(typeUtilisateur, id);
    }
}
