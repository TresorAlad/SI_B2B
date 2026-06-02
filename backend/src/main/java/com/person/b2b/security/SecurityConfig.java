package com.person.b2b.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Routes publiques : auth
                .requestMatchers(HttpMethod.POST, "/api/users/register", "/api/users/login").permitAll()
                // Routes publiques : lecture produits et catégories
                .requestMatchers(HttpMethod.GET,
                    "/api/produits",
                    "/api/produits/{id}",
                    "/api/produits/{id}/image",
                    "/api/produits/mis-en-avant",
                    "/api/produits/vendeur/{vendeurId}",
                    "/api/categories",
                    "/api/categories/{id}").permitAll()
                // Routes publiques : incrémenter les vues
                .requestMatchers(HttpMethod.PATCH, "/api/produits/{id}/vues").permitAll()
                // Tout le reste nécessite un JWT valide
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
