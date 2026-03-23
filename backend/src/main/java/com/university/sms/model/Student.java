package com.university.sms.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "class_id")
    private Class studentClass;

    @Column(name = "roll_number", unique = true)
    private String rollNumber;

    @Column(name = "registration_number", unique = true)
    private String registrationNumber;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "father_name")
    private String fatherName;

    @Column(name = "mother_name")
    private String motherName;

    @Column(name = "address")
    private String address;

    @Column(name = "admission_year")
    private Integer admissionYear;

    @OneToMany(mappedBy = "student")
    private List<Attendance> attendances;

    @OneToMany(mappedBy = "student")
    private List<Marks> marks;

    @OneToMany(mappedBy = "student")
    private List<Leave> leaves;

    @Column(name = "is_active")
    private Boolean isActive = true;
}