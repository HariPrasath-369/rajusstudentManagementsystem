package com.university.sms.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "hods")
@Data
@NoArgsConstructor
public class Hod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "dept_id", nullable = false)
    private Department department;

    @Column(name = "appointment_date")
    private LocalDateTime appointmentDate;

    @Column(name = "office_room")
    private String officeRoom;

    @Column(name = "is_active")
    private Boolean isActive = true;
}