package com.person.b2b.controller;

import com.person.b2b.dto.ProduitResponse;
import com.person.b2b.entity.Produit;
import com.person.b2b.entity.StatutProduit;
import com.person.b2b.service.ProduitService;
import java.io.IOException;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/produits")
public class ProduitController {

    private final ProduitService produitService;

    public ProduitController(ProduitService produitService) {
        this.produitService = produitService;
    }

    @GetMapping
    public ResponseEntity<List<ProduitResponse>> findAll() {
        return ResponseEntity.ok(
                produitService.findAll().stream().map(ProduitResponse::from).toList());
    }

    @GetMapping("/mis-en-avant")
    public ResponseEntity<List<ProduitResponse>> findFeatured() {
        return ResponseEntity.ok(
                produitService.findFeatured().stream().map(ProduitResponse::from).toList());
    }

    @GetMapping("/vendeur/{vendeurId}")
    public ResponseEntity<List<ProduitResponse>> findByVendeur(@PathVariable Long vendeurId) {
        return ResponseEntity.ok(
                produitService.findByVendeur(vendeurId).stream().map(ProduitResponse::from).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProduitResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(ProduitResponse.from(produitService.findById(id)));
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getImage(@PathVariable Long id) {
        Produit produit = produitService.findById(id);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(produit.getImage());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProduitResponse> create(
            @AuthenticationPrincipal Long vendeurId,
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam Long price,
            @RequestParam String categorieNom,
            @RequestParam String brand,
            @RequestParam String whatsapp,
            @RequestPart("image") MultipartFile image,
            @RequestParam(required = false) StatutProduit statut,
            @RequestParam(defaultValue = "true") boolean nouveau) throws IOException {
        Produit produit = produitService.create(
                vendeurId, name, description, price, categorieNom, brand, whatsapp,
                image.getBytes(), statut, nouveau);
        return ResponseEntity.status(HttpStatus.CREATED).body(ProduitResponse.from(produit));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProduitResponse> update(
            @AuthenticationPrincipal Long vendeurId,
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam Long price,
            @RequestParam String categorieNom,
            @RequestParam String brand,
            @RequestParam String whatsapp,
            @RequestPart("image") MultipartFile image,
            @RequestParam(required = false) StatutProduit statut,
            @RequestParam(defaultValue = "true") boolean nouveau) throws IOException {
        Produit produit = produitService.update(
                id, vendeurId, name, description, price, categorieNom, brand, whatsapp,
                image.getBytes(), statut, nouveau);
        return ResponseEntity.ok(ProduitResponse.from(produit));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal Long vendeurId,
            @PathVariable Long id) {
        produitService.delete(id, vendeurId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/vues")
    public ResponseEntity<ProduitResponse> incrementViews(@PathVariable Long id) {
        return ResponseEntity.ok(ProduitResponse.from(produitService.incrementViews(id)));
    }
}
