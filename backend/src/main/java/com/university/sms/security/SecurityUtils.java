package com.university.sms.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public class SecurityUtils {

    private SecurityUtils() {
        // Private constructor to prevent instantiation
    }

    public static UserPrincipal getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            return (UserPrincipal) authentication.getPrincipal();
        }
        return null;
    }

    public static Long getCurrentUserId() {
        UserPrincipal currentUser = getCurrentUser();
        return currentUser != null ? currentUser.getId() : null;
    }

    public static String getCurrentUserEmail() {
        UserPrincipal currentUser = getCurrentUser();
        return currentUser != null ? currentUser.getEmail() : null;
    }

    public static String getCurrentUserRole() {
        UserPrincipal currentUser = getCurrentUser();
        if (currentUser != null && !currentUser.getAuthorities().isEmpty()) {
            return currentUser.getAuthorities().iterator().next().getAuthority();
        }
        return null;
    }

    public static boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated() &&
                !(authentication.getPrincipal() instanceof String &&
                        authentication.getPrincipal().equals("anonymousUser"));
    }

    public static boolean hasRole(String role) {
        UserPrincipal currentUser = getCurrentUser();
        return currentUser != null && currentUser.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals(role));
    }

    public static boolean isPrincipal() {
        return hasRole("ROLE_PRINCIPAL");
    }

    public static boolean isHod() {
        return hasRole("ROLE_HOD");
    }

    public static boolean isTeacher() {
        return hasRole("ROLE_TEACHER");
    }

    public static boolean isCA() {
        return hasRole("ROLE_CA");
    }

    public static boolean isStudent() {
        return hasRole("ROLE_STUDENT");
    }
}