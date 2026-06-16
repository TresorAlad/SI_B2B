package com.person.b2b.config;

import com.person.b2b.entity.RoleUtilisateur;
import com.person.b2b.entity.Sexe;
import com.person.b2b.entity.User;
import com.person.b2b.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminDataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminDataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email:admin@b2b.hunt}")
    private String adminEmail;

    @Value("${app.admin.password:Admin@2026}")
    private String adminPassword;

    @Value("${app.admin.name:Administrateur B2B}")
    private String adminName;

    public AdminDataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        String normalizedEmail = adminEmail.trim().toLowerCase();
        if (userRepository.existsByEmail(normalizedEmail)) {
            return;
        }

        User admin = new User();
        admin.setName(adminName.trim());
        admin.setEmail(normalizedEmail);
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setSexe(Sexe.AUTRE);
        admin.setPaysCode("TG");
        admin.setTelephone("90000000");
        admin.setWhatsapp("22890000000");
        admin.setRole(RoleUtilisateur.ADMIN);
        userRepository.save(admin);
        log.info("Compte administrateur initialisé : {}", normalizedEmail);
    }
}
