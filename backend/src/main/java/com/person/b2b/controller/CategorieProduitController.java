package com.person.b2b.controller;

import com.person.b2b.dto.CategorieProduitResponse;
import com.person.b2b.service.CategorieProduitService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/categories")
public class CategorieProduitController {

    private final CategorieProduitService categorieProduitService;

    public CategorieProduitController(CategorieProduitService categorieProduitService) {
        this.categorieProduitService = categorieProduitService;
    }

    @GetMapping
    public ResponseEntity<List<CategorieProduitResponse>> findAll() {
        return ResponseEntity.ok(
                categorieProduitService.findAll().stream()
                        .map(CategorieProduitResponse::from)
                        .toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategorieProduitResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(
                CategorieProduitResponse.from(categorieProduitService.findById(id)));
    }
}
