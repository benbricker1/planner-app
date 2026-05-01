const API = "http://localhost:8080/api/tasks";

const statusMsg = document.getElementById("statusMsg");
const tbody = document.querySelector("#taskTable tbody");
const filterButtons = document.querySelectorAll(".filters button");
let currentFilter = "all";

// Helper: map category to CSS class
function categoryClass(cat) {
  if (!cat) return "";
  const c = cat.toLowerCase();
  if (c === "homework") return "homework";
  if (c === "exam") return "exam";
  if (c === "quiz") return "quiz";
  if (c === "project") return "project";
  if (c === "study") return "study";
  return "";
}

// Load tasks from backend
async function loadTasks() {
  try {
    statusMsg.textContent = "Loading tasks...";
    let url = API;

    if (currentFilter === "incomplete") {
      url += "?completed=false";
    } else if (currentFilter === "completed") {
      url += "?completed=true";
    } else if (currentFilter === "today") {
      url += "?due=today";
    }

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("HTTP " + res.status);
    }
    const tasks = await res.json();

    tbody.innerHTML = "";

    tasks.forEach(t => {
      const tr = document.createElement("tr");
      if (t.completed) {
        tr.classList.add("completed");
      }

      const tagClass = categoryClass(t.category);

      tr.innerHTML = `
        <td>${t.title}</td>
        <td>${t.courseName || ""}</td>
        <td>
          ${t.category ? `<span class="tag ${tagClass}">${t.category}</span>` : ""}
        </td>
        <td>${t.dueDate || ""}</td>
        <td>${t.priority ?? ""}</td>
        <td>${t.completed ? "Yes" : "No"}</td>
        <td>
          ${t.completed ? "" : `<button class="complete-btn" data-id="${t.taskId}">Complete</button>`}
          <button class="delete-btn" data-id="${t.taskId}">Delete</button>
        </td>
      `;

      tbody.appendChild(tr);
    });

    // Wire up complete buttons
    document.querySelectorAll(".complete-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        try {
          await fetch(`${API}/${id}/complete`, { method: "PATCH" });
          await loadTasks();
        } catch (err) {
          console.error(err);
          statusMsg.textContent = "Error completing task: " + err.message;
        }
      });
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.getAttribute("data-id");
            const confirmDelete = confirm("Are you sure you want to delete this task?");
            if (!confirmDelete) return;

            try {
                await fetch(`${API}/${id}`, { method: "DELETE" });
                await loadTasks();
                statusMsg.textContent = "Task deleted.";
            } catch (err) {
            console.error(err);
            statusMsg.textContent = "Error deleting task: " + err.message;
    }
  });
});

    statusMsg.textContent = `Loaded ${tasks.length} task(s) with filter: ${currentFilter}`;
  } catch (err) {
    console.error(err);
    statusMsg.textContent = "Error loading tasks. Is the backend running?";
  }
}

// Add new task
document.getElementById("taskForm").addEventListener("submit", async e => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const course = document.getElementById("course").value.trim();
  const dueDate = document.getElementById("dueDate").value;
  const category = document.getElementById("category").value;
  const priorityStr = document.getElementById("priority").value.trim();

  if (!title) {
    alert("Task title is required.");
    return;
  }

  const priority = priorityStr ? parseInt(priorityStr, 10) : null;

  const body = {
    title,
    courseName: course || null,
    category: category || null,
    dueDate: dueDate || null,
    priority,
    completed: false
  };

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      throw new Error("HTTP " + res.status);
    }
    e.target.reset();
    await loadTasks();
    statusMsg.textContent = "Task added successfully.";
  } catch (err) {
    console.error(err);
    statusMsg.textContent = "Error adding task: " + err.message;
  }
});

// Filter buttons
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const filter = btn.getAttribute("data-filter");
    if (!filter) return;
    currentFilter = filter;
    loadTasks();
  });
});

// Refresh button
document.getElementById("refreshBtn").addEventListener("click", () => {
  loadTasks();
});

// Initial load
loadTasks();
