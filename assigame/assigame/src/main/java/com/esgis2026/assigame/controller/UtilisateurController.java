package com.esgis2026.assigame.controller;

import com.esgis2026.assigame.entity.Utilisateur;
import com.esgis2026.assigame.service.UtilisateurService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/utilisateur")
public class UtilisateurController {

    final UtilisateurService utilisateurService;

    public UtilisateurController(UtilisateurService utilisateurService) {
        this.utilisateurService = utilisateurService;
    }

    @GetMapping
    public List<Utilisateur> getAllUtilisateur(){
        return utilisateurService.getAllUtilisateurs();
    }

    @PostMapping("/add")
    public Utilisateur createUtilisateur(@RequestBody Utilisateur utilisateur){
        return utilisateurService.createUtilisateur(utilisateur);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteUtilisateur(@PathVariable Long id){
        utilisateurService.deleteUtilisateur(id);
    }

    @PutMapping("/update/{id}")
    public Utilisateur updateUtilisateur(@RequestBody Utilisateur utilisateur, @PathVariable Long id){
        return utilisateurService.updateUtilisateur(utilisateur, id);
    }

}
