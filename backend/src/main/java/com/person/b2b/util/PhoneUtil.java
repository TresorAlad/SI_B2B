package com.person.b2b.util;

import com.person.b2b.exception.BadRequestException;
import java.util.Map;

public final class PhoneUtil {

    private static final Map<String, String> DIAL_CODES = Map.ofEntries(
            Map.entry("TG", "228"),
            Map.entry("BJ", "229"),
            Map.entry("CI", "225"),
            Map.entry("SN", "221"),
            Map.entry("BF", "226"),
            Map.entry("ML", "223"),
            Map.entry("NE", "227"),
            Map.entry("GH", "233"),
            Map.entry("NG", "234"),
            Map.entry("CM", "237"),
            Map.entry("GA", "241"),
            Map.entry("CG", "242"),
            Map.entry("CD", "243"),
            Map.entry("FR", "33"),
            Map.entry("BE", "32"),
            Map.entry("CH", "41"),
            Map.entry("CA", "1"),
            Map.entry("US", "1"),
            Map.entry("GB", "44"),
            Map.entry("DE", "49"),
            Map.entry("MA", "212"),
            Map.entry("DZ", "213"),
            Map.entry("TN", "216"));

    private PhoneUtil() {}

    public static String buildFullNumber(String paysCode, String telephone) {
        String code = paysCode != null ? paysCode.trim().toUpperCase() : "";
        String dial = DIAL_CODES.get(code);
        if (dial == null) {
            throw new BadRequestException("Code pays invalide : " + paysCode);
        }

        String digits = telephone != null ? telephone.replaceAll("\\D", "") : "";
        if (digits.isBlank()) {
            throw new BadRequestException("Numéro de téléphone invalide");
        }

        if (digits.startsWith(dial)) {
            return digits;
        }
        if (digits.startsWith("0")) {
            digits = digits.substring(1);
        }
        return dial + digits;
    }

    public static boolean isValidCountryCode(String paysCode) {
        return paysCode != null && DIAL_CODES.containsKey(paysCode.trim().toUpperCase());
    }
}
