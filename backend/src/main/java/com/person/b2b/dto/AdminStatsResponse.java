package com.person.b2b.dto;

public record AdminStatsResponse(
        long totalUsers,
        long totalVendeurs,
        long totalAdmins,
        long totalProduits,
        long totalVues,
        long produitsDisponibles,
        long produitsReserves,
        long produitsIndisponibles,
        long produitsMisEnAvant,
        long totalCategories) {}
