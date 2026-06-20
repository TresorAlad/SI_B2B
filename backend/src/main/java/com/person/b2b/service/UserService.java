package com.person.b2b.service;

import com.person.b2b.entity.Produit;
import com.person.b2b.entity.RoleUtilisateur;
import com.person.b2b.entity.Sexe;
import com.person.b2b.entity.User;
import com.person.b2b.exception.BadRequestException;
import com.person.b2b.exception.EntityNotFoundException;
import com.person.b2b.exception.InvalidCredentialsException;
import com.person.b2b.repository.ProduitRepository;
import com.person.b2b.repository.UserRepository;
import com.person.b2b.util.PhoneUtil;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final ProduitRepository produitRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            ProduitRepository produitRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.produitRepository = produitRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur introuvable : " + id));
    }

    @Transactional(readOnly = true)
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur introuvable : " + email));
    }

    public User register(
            String name,
            String email,
            Sexe sexe,
            String paysCode,
            String telephone,
            String password,
            String confirmPassword) {
        if (!password.equals(confirmPassword)) {
            throw new BadRequestException("Les mots de passe ne correspondent pas");
        }
        if (!PhoneUtil.isValidCountryCode(paysCode)) {
            throw new BadRequestException("Pays invalide");
        }

        String normalizedEmail = email.trim().toLowerCase();
        String fullPhone = PhoneUtil.buildFullNumber(paysCode, telephone);

        User user = new User();
        user.setName(name.trim());
        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(password));
        user.setSexe(sexe != null ? sexe : Sexe.AUTRE);
        user.setPaysCode(paysCode.trim().toUpperCase());
        user.setTelephone(telephone.replaceAll("\\D", "").replaceFirst("^0", ""));
        user.setWhatsapp(fullPhone);
        user.setRole(RoleUtilisateur.VENDEUR);

        try {
            return userRepository.save(user);
        } catch (DataIntegrityViolationException ex) {
            throw new BadRequestException("Cet email est déjà utilisé");
        }
    }

    public User login(String email, String password) {
        String normalizedEmail = email.trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidCredentialsException();
        }
        return user;
    }

    public boolean toggleFavorite(Long userId, Long produitId) {
        User user = findById(userId);
        Produit produit = produitRepository.findById(produitId)
                .orElseThrow(() -> new EntityNotFoundException("Produit introuvable : " + produitId));

        Set<Produit> favoris = user.getFavoris();
        boolean added;
        if (favoris.contains(produit)) {
            favoris.remove(produit);
            added = false;
        } else {
            favoris.add(produit);
            added = true;
        }
        userRepository.save(user);
        return added;
    }

    @Transactional(readOnly = true)
    public boolean isFavorite(Long userId, Long produitId) {
        User user = findById(userId);
        return user.getFavoris().stream().anyMatch(p -> p.getId().equals(produitId));
    }

    @Transactional(readOnly = true)
    public List<Produit> findFavorites(Long userId) {
        return new ArrayList<>(findById(userId).getFavoris());
    }

    public User updateProfile(
            Long userId,
            String name,
            String email,
            String paysCode,
            String telephone,
            String currentPassword,
            String newPassword,
            String confirmPassword) {
        User user = findById(userId);

        if (name == null || name.isBlank()) {
            throw new BadRequestException("Le nom est obligatoire");
        }
        if (email == null || email.isBlank()) {
            throw new BadRequestException("L'email est obligatoire");
        }
        if (telephone == null || telephone.isBlank()) {
            throw new BadRequestException("Le numéro de téléphone est obligatoire");
        }
        if (!PhoneUtil.isValidCountryCode(paysCode)) {
            throw new BadRequestException("Pays invalide");
        }

        boolean wantsPasswordChange = newPassword != null && !newPassword.isBlank();
        if (wantsPasswordChange) {
            if (currentPassword == null || currentPassword.isBlank()) {
                throw new BadRequestException("Le mot de passe actuel est requis pour le changer");
            }
            if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                throw new BadRequestException("Mot de passe actuel incorrect");
            }
            if (newPassword.length() < 6) {
                throw new BadRequestException("Le nouveau mot de passe doit contenir au moins 6 caractères");
            }
            if (!newPassword.equals(confirmPassword)) {
                throw new BadRequestException("Les mots de passe ne correspondent pas");
            }
            user.setPassword(passwordEncoder.encode(newPassword));
        }

        String normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail.equals(user.getEmail()) && userRepository.existsByEmail(normalizedEmail)) {
            throw new BadRequestException("Cet email est déjà utilisé");
        }

        String fullPhone = PhoneUtil.buildFullNumber(paysCode, telephone);
        user.setName(name.trim());
        user.setEmail(normalizedEmail);
        user.setPaysCode(paysCode.trim().toUpperCase());
        user.setTelephone(telephone.replaceAll("\\D", "").replaceFirst("^0", ""));
        user.setWhatsapp(fullPhone);

        try {
            return userRepository.save(user);
        } catch (DataIntegrityViolationException ex) {
            throw new BadRequestException("Cet email est déjà utilisé");
        }
    }

    public void deleteAccount(Long userId, String password) {
        User user = findById(userId);

        if (password == null || password.isBlank()) {
            throw new BadRequestException("Le mot de passe est requis pour supprimer le compte");
        }
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadRequestException("Mot de passe incorrect");
        }

        List<Produit> produits = produitRepository.findByVendeurIdOrderByDatePublicationDesc(userId);
        produitRepository.deleteAll(produits);

        user.getFavoris().clear();
        userRepository.save(user);
        userRepository.delete(user);
    }
}
