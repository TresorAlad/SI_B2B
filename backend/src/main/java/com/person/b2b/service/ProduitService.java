package com.person.b2b.service;

import com.person.b2b.entity.CategorieProduit;
import com.person.b2b.entity.Produit;
import com.person.b2b.entity.StatutProduit;
import com.person.b2b.entity.User;
import com.person.b2b.exception.BadRequestException;
import com.person.b2b.exception.EntityNotFoundException;
import com.person.b2b.exception.ForbiddenOperationException;
import com.person.b2b.repository.ProduitRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ProduitService {

    private final ProduitRepository produitRepository;
    private final UserService userService;
    private final CategorieProduitService categorieProduitService;

    public ProduitService(
            ProduitRepository produitRepository,
            UserService userService,
            CategorieProduitService categorieProduitService) {
        this.produitRepository = produitRepository;
        this.userService = userService;
        this.categorieProduitService = categorieProduitService;
    }

    @Transactional(readOnly = true)
    public List<Produit> findAll() {
        return produitRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Produit> findByVendeur(Long vendeurId) {
        userService.findById(vendeurId);
        return produitRepository.findByVendeurIdOrderByDatePublicationDesc(vendeurId);
    }

    @Transactional(readOnly = true)
    public List<Produit> findFeatured() {
        return produitRepository.findByMisEnAvantTrueOrderByDatePublicationDesc();
    }

    @Transactional(readOnly = true)
    public Produit findById(Long id) {
        return produitRepository.findWithRelationsById(id)
                .orElseThrow(() -> new EntityNotFoundException("Produit introuvable : " + id));
    }

    public Produit create(
            Long vendeurId,
            String name,
            String description,
            Long price,
            String categorieNom,
            String brand,
            String whatsapp,
            byte[] image,
            StatutProduit statut,
            boolean nouveau) {
        validateProductInput(name, description, price, whatsapp, image);

        User vendeur = userService.findById(vendeurId);
        CategorieProduit categorie = categorieProduitService.findOrCreateByNom(categorieNom);

        Produit produit = new Produit();
        applyFields(produit, name, description, price, brand, whatsapp, image, statut, nouveau);
        produit.setVendeur(vendeur);
        produit.setCategorie(categorie);
        produit.setViews(0);
        produit.setDatePublication(LocalDate.now());
        produit.setMisEnAvant(false);

        return produitRepository.save(produit);
    }

    public Produit update(
            Long produitId,
            Long vendeurId,
            String name,
            String description,
            Long price,
            String categorieNom,
            String brand,
            String whatsapp,
            byte[] image,
            StatutProduit statut,
            boolean nouveau,
            boolean updateImage) {
        Produit produit = findOwnedByVendeur(produitId, vendeurId);
        validateProductInput(name, description, price, whatsapp, updateImage ? image : produit.getImage());
        CategorieProduit categorie = categorieProduitService.findOrCreateByNom(categorieNom);

        applyFields(produit, name, description, price, brand, whatsapp,
                updateImage ? image : produit.getImage(), statut, nouveau);
        produit.setCategorie(categorie);

        return produitRepository.save(produit);
    }

    public void delete(Long produitId, Long vendeurId) {
        Produit produit = findOwnedByVendeur(produitId, vendeurId);
        produitRepository.delete(produit);
    }

    public Produit incrementViews(Long produitId) {
        int updated = produitRepository.incrementViews(produitId);
        if (updated == 0) {
            throw new EntityNotFoundException("Produit introuvable : " + produitId);
        }
        return produitRepository.findWithRelationsById(produitId)
                .orElseThrow(() -> new EntityNotFoundException("Produit introuvable : " + produitId));
    }

    public Produit setMisEnAvant(Long produitId, Long vendeurId, boolean misEnAvant) {
        Produit produit = findOwnedByVendeur(produitId, vendeurId);
        produit.setMisEnAvant(misEnAvant);
        return produitRepository.save(produit);
    }

    private Produit findOwnedByVendeur(Long produitId, Long vendeurId) {
        Produit produit = findById(produitId);
        if (!produit.getVendeur().getId().equals(vendeurId)) {
            throw new ForbiddenOperationException("Ce produit n'appartient pas à cet utilisateur");
        }
        return produit;
    }

    private void applyFields(
            Produit produit,
            String name,
            String description,
            Long price,
            String brand,
            String whatsapp,
            byte[] image,
            StatutProduit statut,
            boolean nouveau) {
        produit.setName(name.trim());
        produit.setDescription(description.trim());
        produit.setPrice(price);
        produit.setBrand(brand.trim());
        produit.setWhatsapp(whatsapp.trim());
        produit.setImage(image);
        produit.setStatut(statut != null ? statut : StatutProduit.DISPONIBLE);
        produit.setNouveau(nouveau);
    }

    private void validateProductInput(
            String name, String description, Long price, String whatsapp, byte[] image) {
        if (name == null || name.isBlank()) {
            throw new BadRequestException("Le nom du produit est obligatoire");
        }
        if (description == null || description.isBlank()) {
            throw new BadRequestException("La description du produit est obligatoire");
        }
        if (price == null || price <= 0) {
            throw new BadRequestException("Le prix doit être supérieur à 0");
        }
        if (whatsapp == null || whatsapp.isBlank()) {
            throw new BadRequestException("Le numéro WhatsApp est obligatoire");
        }
        if (image == null || image.length == 0) {
            throw new BadRequestException("L'image du produit est obligatoire");
        }
    }
}
