package com.example.studyplanner.repository;

import com.example.studyplanner.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Integer> {

    List<Task> findByCompleted(boolean completed);

    List<Task> findByDueDate(LocalDate dueDate);
}
