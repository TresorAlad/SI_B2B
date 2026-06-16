package com.person.b2b.controller;

import com.person.b2b.dto.ProduitResponse;
import com.person.b2b.dto.ProduitSummaryResponse;
import com.person.b2b.entity.Produit;
import com.person.b2b.entity.StatutProduit;
import com.person.b2b.exception.BadRequestException;
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
    public ResponseEntity<List<ProduitSummaryResponse>> findAll() {
        return ResponseEntity.ok(
                produitService.findAll().stream().map(ProduitSummaryResponse::from).toList());
    }

    @GetMapping("/mis-en-avant")
    public ResponseEntity<List<ProduitSummaryResponse>> findFeatured() {
        return ResponseEntity.ok(
                produitService.findFeatured().stream().map(ProduitSummaryResponse::from).toList());
    }

    @GetMapping("/vendeur/{vendeurId}")
    public ResponseEntity<List<ProduitSummaryResponse>> findByVendeur(@PathVariable Long vendeurId) {
        return ResponseEntity.ok(
                produitService.findByVendeur(vendeurId).stream().map(ProduitSummaryResponse::from).toList());
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
            @RequestParam(defaultValue = "-") String brand,
            @RequestParam String whatsapp,
            @RequestPart("image") MultipartFile image,
            @RequestParam(required = false) StatutProduit statut,
            @RequestParam(defaultValue = "true") boolean nouveau) throws IOException {
        if (image == null || image.isEmpty()) {
            throw new BadRequestException("L'image du produit est obligatoire");
        }
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
            @RequestParam(defaultValue = "-") String brand,
            @RequestParam String whatsapp,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestParam(required = false) StatutProduit statut,
            @RequestParam(defaultValue = "true") boolean nouveau) throws IOException {
        boolean updateImage = image != null && !image.isEmpty();
        Produit produit = produitService.update(
                id, vendeurId, name, description, price, categorieNom, brand, whatsapp,
                updateImage ? image.getBytes() : null, statut, nouveau, updateImage);
        return ResponseEntity.ok(ProduitResponse.from(produit));
    }

    @PatchMapping("/{id}/mis-en-avant")
    public ResponseEntity<ProduitResponse> setMisEnAvant(
            @AuthenticationPrincipal Long vendeurId,
            @PathVariable Long id,
            @RequestParam boolean misEnAvant) {
        return ResponseEntity.ok(
                ProduitResponse.from(produitService.setMisEnAvant(id, vendeurId, misEnAvant)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal Long vendeurId,
            @PathVariable Long id) {
        produitService.delete(id, vendeurId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/vues")
    public ResponseEntity<ProduitSummaryResponse> incrementViews(@PathVariable Long id) {
        return ResponseEntity.ok(ProduitSummaryResponse.from(produitService.incrementViews(id)));
    }
}
