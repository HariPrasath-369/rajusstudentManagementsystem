package com.university.sms.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "teachers")
@Data
@NoArgsConstructor
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "dept_id")
    private Department department;

    @Column(name = "employee_id", unique = true)
    private String employeeId;

    @Column(name = "qualification")
    private String qualification;

    @Column(name = "specialization")
    private String specialization;

    @Column(name = "joining_date")
    private LocalDateTime joiningDate;

    @Column(name = "is_class_advisor")
    private Boolean isClassAdvisor = false;

    @OneToMany(mappedBy = "advisor")
    private List<Class> advisorClasses;

    @OneToMany(mappedBy = "teacher")
    private List<ClassSubject> subjects;

    @Column(name = "is_active")
    private Boolean isActive = true;
}