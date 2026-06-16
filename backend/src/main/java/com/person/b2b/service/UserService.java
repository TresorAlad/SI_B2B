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
}
