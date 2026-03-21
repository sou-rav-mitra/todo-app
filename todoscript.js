const greeting = document.getElementById("welcomeMsg");
const name = localStorage.getItem("username");

if (name) {
  greeting.textContent = `Hello, ${name}!`;
} else {
  greeting.textContent = "Hello!";
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("username");
  window.location.href = "index.html";
});


const username = localStorage.getItem("username");
const taskKey = `tasks_${username}`;
let tasks = JSON.parse(localStorage.getItem(taskKey)) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem(taskKey, JSON.stringify(tasks));
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  const emptyState = document.getElementById("emptyState");

  let filtered = tasks.filter((t) => {
    if (currentFilter === "active") return !t.completed;
    if (currentFilter === "completed") return t.completed;
    return true;
  });

  
  taskList.innerHTML = "";

  if (filtered.length === 0) {
    taskList.innerHTML = `
      <div class="empty-state">
        <i class="fa-regular fa-clipboard"></i>
        <p>No tasks here!</p>
      </div>`;
    return;
  }

  filtered.forEach((task) => {
    const card = document.createElement("div");
    card.className = `task-card ${task.completed ? "completed" : ""}`;
    card.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""} data-id="${task.id}" />
      <span class="task-text">${task.text}</span>
      <span class="priority-badge ${task.priority}">${task.priority}</span>
      <button class="delete-btn" data-id="${task.id}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;
    taskList.appendChild(card);
  });

  updateCounter();
}

function updateCounter() {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  document.getElementById("taskCounter").textContent =
    `${completed} of ${total} task${total !== 1 ? "s" : ""} completed`;
}


document.getElementById("addBtn").addEventListener("click", addTask);
document.getElementById("taskInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

function addTask() {
  const input = document.getElementById("taskInput");
  const priority = document.getElementById("prioritySelect").value;
  const text = input.value.trim();

  if (text === "") return;

  tasks.push({ id: Date.now(), text, priority, completed: false });
  saveTasks();
  renderTasks();
  input.value = "";
}


document.getElementById("taskList").addEventListener("click", (e) => {
  const id = parseInt(e.target.closest("[data-id]")?.dataset.id);
  if (!id) return;

  if (e.target.closest(".delete-btn")) {
    tasks = tasks.filter((t) => t.id !== id);
  } else if (e.target.type === "checkbox") {
    tasks = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t,
    );
  }

  saveTasks();
  renderTasks();
});


document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

renderTasks();
