package com.university.sms.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class DepartmentComparisonResponse {
    private Map<String, DepartmentStats> departmentStats;
}
