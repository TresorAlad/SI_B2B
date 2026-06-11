package com.esgis2026.assigame.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Objects;

@Entity
@Getter
@Setter
@Table(name = "utilisateur")
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_utilisateur;

    @Column(nullable = false ,length = 40)
    private String nom_utilisateur;

    @Column(nullable = false, length = 40)
    private String prenom_utilisateur;

    @Column( nullable = false, length = 1)
    private String sexe_utilisateur;

    @Column(nullable = false, unique = true)
    private String telephone_urilisateur;

    @Column(unique = true, length = 100)
    private String mail_utilisateur;

    @Column(nullable = false, length = 100)
    private String Login_utilisateur;

    @Column(nullable = false, length = 100)
    private String Password_utilisateur;

    @Column( unique = false, length = 200)
    private String residence_utilisateur;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_type_utilisateur")
    private TypeUtilisateur type_utilisateur;

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Utilisateur that = (Utilisateur) o;
        return Objects.equals(id_utilisateur, that.id_utilisateur);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id_utilisateur);
    }

    @Override
    public String toString() {
        return "Utilisateur{" +
                "id_utilisateur=" + id_utilisateur +
                ", nom_utilisateur='" + nom_utilisateur + '\'' +
                ", prenom_utilisateur='" + prenom_utilisateur + '\'' +
                ", sexe_utilisateur='" + sexe_utilisateur + '\'' +
                ", telephone_urilisateur='" + telephone_urilisateur + '\'' +
                ", mail_utilisateur='" + mail_utilisateur + '\'' +
                ", Login_utilisateur='" + Login_utilisateur + '\'' +
                ", Password_utilisateur='" + Password_utilisateur + '\'' +
                ", residence_utilisateur='" + residence_utilisateur + '\'' +
                ", type_utilisateur=" + type_utilisateur +
                '}';
    }
}
