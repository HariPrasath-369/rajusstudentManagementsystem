package com.university.sms.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "classes")
@Data
@NoArgsConstructor
public class Class {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "dept_id", nullable = false)
    private Department department;

    @Column(nullable = false)
    private Integer year;

    private String section;

    @Column(name = "class_size")
    private Integer classSize;

    @ManyToOne
    @JoinColumn(name = "advisor_id")
    private Teacher advisor;

    @OneToMany(mappedBy = "studentClass")
    private List<Student> students;

    @OneToMany(mappedBy = "classEntity")
    private List<ClassSubject> subjects;

    @OneToMany(mappedBy = "classEntity")
    private List<Timetable> timetables;

    @OneToMany(mappedBy = "classEntity")
    private List<Semester> semesters;

    @Column(name = "is_active")
    private Boolean isActive = true;

    public String getClassName() {
        return department.getCode() + " " + year + (section != null ? section : "");
    }
}