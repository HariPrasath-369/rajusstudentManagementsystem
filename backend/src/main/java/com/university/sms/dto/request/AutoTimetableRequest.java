package com.university.sms.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class AutoTimetableRequest {
    private Long departmentId;
    private Long classId;
    private List<Long> subjectIds;
    private List<Long> teacherIds;
    private String academicYear;
    private Integer semester;
    private List<Long> classIds;
}
