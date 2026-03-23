package com.university.sms.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "subjects")
@Data
@NoArgsConstructor
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true)
    private String code;

    @Column(name = "credit_hours")
    private Integer creditHours;

    @ManyToOne
    @JoinColumn(name = "dept_id")
    private Department department;

    @OneToMany(mappedBy = "subject")
    private List<ClassSubject> classes;

    private Integer semester;

    @Column(name = "is_elective")
    private Boolean isElective = false;

    @Column(name = "is_active")
    private Boolean isActive = true;
}