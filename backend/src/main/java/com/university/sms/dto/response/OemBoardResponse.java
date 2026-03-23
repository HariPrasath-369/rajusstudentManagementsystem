package com.university.sms.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class OemBoardResponse {
    private Long subjectId;
    private String subjectName;
    private Long classId;
    private List<OemBoardEntry> entries;
}
