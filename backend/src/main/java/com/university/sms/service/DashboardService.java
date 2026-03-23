package com.university.sms.service;

import com.university.sms.dto.response.DashboardResponse;

import com.university.sms.security.UserPrincipal;

public interface DashboardService {
    DashboardResponse getStudentDashboard(Long userId);
    DashboardResponse getPrincipalDashboard(Long userId);
    DashboardResponse getHodDashboard(Long userId);
    DashboardResponse getTeacherDashboard(Long userId);
    DashboardResponse getDashboardByRole(UserPrincipal currentUser);
}
