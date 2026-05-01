USE studyplanner;

CREATE TABLE tasks (
  task_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  course_name VARCHAR(120),
  category VARCHAR(60),
  due_date DATE,
  priority INT,
  completed TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);