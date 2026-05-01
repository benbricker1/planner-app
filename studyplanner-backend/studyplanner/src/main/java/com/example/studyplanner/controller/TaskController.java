package com.example.studyplanner.controller;

import com.example.studyplanner.model.Task;
import com.example.studyplanner.repository.TaskRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*") // allow Electron
public class TaskController {

    private final TaskRepository repo;

    public TaskController(TaskRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Task> getTasks(
            @RequestParam(required = false) Boolean completed,
            @RequestParam(required = false) String due
    ) {
        if (completed != null) {
            return repo.findByCompleted(completed);
        }
        if ("today".equalsIgnoreCase(due)) {
            return repo.findByDueDate(LocalDate.now());
        }
        return repo.findAll();
    }

    @PostMapping
    public Task addTask(@RequestBody Task task) {
        task.setTaskId(null);
        return repo.save(task);
    }

    @PatchMapping("/{id}/complete")
    public Task completeTask(@PathVariable Integer id) {
        Task t = repo.findById(id).orElseThrow();
        t.setCompleted(true);
        return repo.save(t);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Integer id) {
        repo.deleteById(id);
    }
}

