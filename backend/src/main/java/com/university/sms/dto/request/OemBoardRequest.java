package com.university.sms.dto.request;

import com.university.sms.dto.response.OemBoardEntry;
import lombok.Data;
import java.util.List;

@Data
public class OemBoardRequest {
    private Long subjectId;
    private Long classId;
    private Integer semester;
    private List<OemBoardEntry> entries;
}
