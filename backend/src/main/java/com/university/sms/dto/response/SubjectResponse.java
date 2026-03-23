package com.university.sms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubjectResponse {
    private Long id;
    private String name;
    private String code;
    private Integer creditHours;
    private String type;
    private Integer semester;
    private Long departmentId;
}
