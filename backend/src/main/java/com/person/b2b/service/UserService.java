package com.person.b2b.service;

import com.person.b2b.entity.Produit;
import com.person.b2b.entity.User;
import com.person.b2b.exception.EmailAlreadyExistsException;
import com.person.b2b.exception.EntityNotFoundException;
import com.person.b2b.exception.InvalidCredentialsException;
import com.person.b2b.repository.ProduitRepository;
import com.person.b2b.repository.UserRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final ProduitRepository produitRepository;

    public UserService(UserRepository userRepository, ProduitRepository produitRepository) {
        this.userRepository = userRepository;
        this.produitRepository = produitRepository;
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

    public User register(String name, String email, String password, String whatsapp) {
        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException(email);
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(password);
        user.setWhatsapp(whatsapp != null && !whatsapp.isBlank() ? whatsapp : "22890000000");
        return userRepository.save(user);
    }

    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(InvalidCredentialsException::new);

        if (!user.getPassword().equals(password)) {
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
