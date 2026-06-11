package com.esgis2026.assigame.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Objects;

@Entity
@Getter
@Setter
@Table(name = "typeutilisateur")
public class TypeUtilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_type_utilisateur;

    @Column(unique = true, nullable = false, length = 40)
    private String libelle_type_utilisateur;

    @Column( length = 200)
    private String description_type_utilisateur;

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        TypeUtilisateur that = (TypeUtilisateur) o;
        return Objects.equals(id_type_utilisateur, that.id_type_utilisateur);
    }

    @Override
    public String toString() {
        return "TypeUtilisateur{" +
                "id_type_utilisateur=" + id_type_utilisateur +
                ", libelle_type_utilisateur='" + libelle_type_utilisateur + '\'' +
                ", description_type_utilisateur='" + description_type_utilisateur + '\'' +
                '}';
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id_type_utilisateur);
    }

}
