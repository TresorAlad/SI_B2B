package com.esgis2026.assigame.controller;

import com.esgis2026.assigame.entity.CategorieProduit;
import com.esgis2026.assigame.repository.CategorieProduitRepository;
import com.esgis2026.assigame.service.CategorieProduitService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categorieproduit")
public class CategorieProduitController {
    private final CategorieProduitService categorieProduitService;

    public CategorieProduitController(CategorieProduitService categorieProduitService) {
        this.categorieProduitService = categorieProduitService;
    }

    @GetMapping("/list")
    public List<CategorieProduit> getAllCategorieProduits() {
        return categorieProduitService.getAllCategorieProduits();
    }

    @PostMapping("/add")
    public CategorieProduit addCategorieProduit(@RequestBody CategorieProduit categorieProduit) {
        return categorieProduitService.createCategorieProduit(categorieProduit);
    }

    @DeleteMapping("delete/{id}")
    public void deleteCategorieProduit(@PathVariable Long id) {
        categorieProduitService.deleteCategorieProduit(id);
    }

    @PutMapping("update/{id}")
    public CategorieProduit updateCategorieProduit(@RequestBody CategorieProduit categorieProduit, @PathVariable Long id) {
        return categorieProduitService.updateCategorieProduit(id, categorieProduit);

    }
}
