package com.university.sms.model;

import com.university.sms.model.enums.MarksType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "marks")
@Data
@NoArgsConstructor
public class Marks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Enumerated(EnumType.STRING)
    @Column(name = "marks_type", nullable = false)
    private MarksType marksType;

    @Column(name = "marks_obtained")
    private Double marksObtained;

    @Column(name = "max_marks")
    private Double maxMarks;

    @Column(name = "academic_year")
    private String academicYear;

    @Column(name = "semester")
    private Integer semester;

    @Column(name = "entered_by")
    private Long enteredBy;

    @Column(name = "entered_at")
    private LocalDateTime enteredAt;

    @Column(name = "is_published")
    private Boolean isPublished = false;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;
}