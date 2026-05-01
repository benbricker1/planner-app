package com.example.studyplanner.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "tasks")
@Data
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_id")
    private Integer taskId;

    private String title;

    @Column(name = "course_name")
    private String courseName;

    private String category;

    @Column(name = "due_date")
    private LocalDate dueDate;

    private Integer priority;

    private boolean completed;
}
