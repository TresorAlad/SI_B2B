package com.esgis2026.assigame.service;

import com.esgis2026.assigame.entity.CategorieProduit;
import com.esgis2026.assigame.entity.Produit;
import com.esgis2026.assigame.repository.ProduitRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class ProduitService {

    final ProduitRepository produitRepository;

    public ProduitService(ProduitRepository produitRepository) {
        this.produitRepository = produitRepository;
    }

    public List<Produit> getAllProduits(){
        return produitRepository.findAll();
    }

    public Produit createProduit(Produit produit, MultipartFile image) throws IOException {
        produit.setImage_type(image.getContentType());
        produit.setImage(image.getBytes());
        return produitRepository.save(produit);
    }

    public Produit updateProduit(Produit details, Long id){
        Produit produit = produitRepository.findById(id)
                .orElseThrow(()->new RuntimeException("produit not found with id "+id));
        
        if(details.getNom_produit() != null) {
            produit.setNom_produit(details.getNom_produit());
        }
        if(details.getPrix() != null) {
            produit.setPrix(details.getPrix());
        }
        if(details.getDescription() != null) {
            produit.setDescription(details.getDescription());
        }
        if(details.getImage() != null) {
            produit.setImage(details.getImage());
        }
        if(details.getImage_type() != null) {
            produit.setImage_type(details.getImage_type());
        }
        if(details.getStatut() != null) {
            produit.setStatut(details.getStatut());
        }
        if(details.getCategorie_produit() != null) {
            produit.setCategorie_produit(details.getCategorie_produit());
        }
        if(details.getDate_ajout() != null) {
            produit.setDate_ajout(details.getDate_ajout());
        }
        
        return produitRepository.save(produit);
    }

    public void deleteProduit(Long id){
        Optional<Produit> produit = produitRepository.findById(id);
        if (produit.isPresent()){
            produitRepository.deleteById(id);
        }

    }

    public Produit getProduitById(Long id){
        return produitRepository.findById(id)
                .orElseThrow(()->new RuntimeException("produit not found with id "+id));
    }

    public Produit uploadImage(Long id, MultipartFile file) throws IOException {
        Produit produit = getProduitById(id);
        produit.setImage(file.getBytes());
        produit.setImage_type(file.getContentType());
        return produitRepository.save(produit);
    }
}
