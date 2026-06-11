package com.esgis2026.assigame.controller;

import com.esgis2026.assigame.entity.Produit;
import com.esgis2026.assigame.service.ProduitService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/produit")
public class ProduitController {
    final ProduitService produitService;

    public ProduitController(ProduitService produitService) {
        this.produitService = produitService;
    }

    @GetMapping
    public List<Produit> getAllProduit() {
        return produitService.getAllProduits();
    }
    @GetMapping("/{id}")
    public Produit getProduitById(@PathVariable Long id) {
        return produitService.getProduitById(id);
    }
    

    @PostMapping("/add")
    public ResponseEntity<?> createProduit(@RequestPart Produit produit, @RequestPart MultipartFile image) {
        try{
            Produit produit1 = produitService.createProduit(produit,image);
            return new ResponseEntity<>(produit1, HttpStatus.CREATED);
        } catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/delete/{id}")
    public void deleteProduit(@PathVariable Long id) {
        produitService.deleteProduit(id);
    }

    @PutMapping("/update/{id}")
    public Produit updateProduit(@RequestBody Produit produit, @PathVariable Long id) {
        return produitService.updateProduit(produit, id);
    }

//    @PostMapping("/{id}/upload-image")
//    public ResponseEntity<Produit> uploadImage(
//            @PathVariable Long id,
//            @RequestParam("file") MultipartFile file) {
//        try {
//            if (file.isEmpty()) {
//                return ResponseEntity.badRequest().build();
//            }
//            Produit produit = produitService.uploadImage(id, file);
//            return ResponseEntity.ok(produit);
//        } catch (IOException e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//        } catch (RuntimeException e) {
//            return ResponseEntity.notFound().build();
//        }
//    }
//
//    @GetMapping("/{id}/image")
//    public ResponseEntity<byte[]> getImage(@PathVariable Long id) {
//        try {
//            Produit produit = produitService.getProduitById(id);
//            if (produit.getImage() != null) {
//                return ResponseEntity.ok()
//                        .header("Content-Type", produit.getImage_type() != null ? produit.getImage_type() : "application/octet-stream")
//                        .body(produit.getImage());
//            }
//            return ResponseEntity.notFound().build();
//        } catch (RuntimeException e) {
//            return ResponseEntity.notFound().build();
//        }
//    }

}
