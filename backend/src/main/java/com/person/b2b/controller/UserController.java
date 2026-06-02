package com.person.b2b.controller;

import com.person.b2b.dto.AuthResponse;
import com.person.b2b.dto.ProduitResponse;
import com.person.b2b.dto.UserResponse;
import com.person.b2b.entity.User;
import com.person.b2b.security.JwtUtil;
import com.person.b2b.service.UserService;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public UserController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam(required = false) String whatsapp) {
        User user = userService.register(name, email, password, whatsapp);
        String token = jwtUtil.generateToken(user.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthResponse(token, UserResponse.from(user)));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestParam String email,
            @RequestParam String password) {
        User user = userService.login(email, password);
        String token = jwtUtil.generateToken(user.getId());
        return ResponseEntity.ok(new AuthResponse(token, UserResponse.from(user)));
    }

    @PostMapping("/favoris/{produitId}")
    public ResponseEntity<Map<String, Boolean>> toggleFavorite(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long produitId) {
        boolean added = userService.toggleFavorite(userId, produitId);
        return ResponseEntity.ok(Map.of("added", added));
    }

    @GetMapping("/favoris/{produitId}")
    public ResponseEntity<Map<String, Boolean>> isFavorite(
            @AuthenticationPrincipal Long userId,
            @PathVariable Long produitId) {
        boolean isFav = userService.isFavorite(userId, produitId);
        return ResponseEntity.ok(Map.of("isFavorite", isFav));
    }

    @GetMapping("/favoris")
    public ResponseEntity<List<ProduitResponse>> getFavorites(@AuthenticationPrincipal Long userId) {
        List<ProduitResponse> favoris = userService.findFavorites(userId)
                .stream()
                .map(ProduitResponse::from)
                .toList();
        return ResponseEntity.ok(favoris);
    }
}
