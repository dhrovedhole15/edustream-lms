package com.edustream.lms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LectureCompleteRequest {
    private Long userId;
    private Long courseId;
    private Long lectureId;
}
