const API_URL = "https://tasker-backend-92ol.onrender.com/api";

/* ================= AUTH ================= */

function loadAuthUI() {
    const authArea = document.getElementById("authArea");
    if (!authArea) return;

    const token = localStorage.getItem("token");

    if (!token) {
        authArea.innerHTML = `
            <a href="login.html">
                <button class="auth-btn">Login</button>
            </a>

            <a href="signup.html">
                <button class="auth-btn">Signup</button>
            </a>
        `;
    } else {
        authArea.innerHTML = `
            <div class="user-box">
                <i class="fa-solid fa-user"></i>
                <span>${localStorage.getItem("username") || "User"}</span>

                <button class="logout-btn" onclick="logout()">
                    Logout
                </button>
            </div>
        `;
    }
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    location.reload();
}

loadAuthUI();

/* ================= VARIABLES ================= */

const taskContainer = document.getElementById("taskContainer");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

let tasks = [];

/* ================= LOAD TASKS ================= */

async function loadTasks() {

    try {

        const token = localStorage.getItem("token");

        if (!token) return;

        const res = await fetch(`${API_URL}/tasks`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await res.json();

        tasks = Array.isArray(data) ? data : [];

        renderTasks();

    } catch (err) {

        console.log("Error loading tasks:", err);

    }
}

loadTasks();

/* ================= RENDER TASKS ================= */

function renderTasks() {

    if (!taskContainer) return;

    taskContainer.innerHTML = "";

    tasks.forEach(task => {

        const taskCard = document.createElement("div");

        taskCard.classList.add("task-card");

        taskCard.innerHTML = `
            <h3>${task.title}</h3>

            <p>${task.description || ""}</p>

            <p class="task-date">
                Due Date:
                ${
                    task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "No date"
                }
            </p>

            <span class="priority ${(task.priority || "low").toLowerCase()}">
                ${task.priority || "Low"}
            </span>

            <div class="task-actions">

                <button
                    class="complete-btn"
                    onclick="toggleComplete('${task._id}')"
                >
                    ${task.completed ? "Completed" : "Complete"}
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask('${task._id}')"
                >
                    Delete
                </button>

            </div>
        `;

        if (task.completed) {
            taskCard.style.opacity = "0.6";
        }

        taskContainer.appendChild(taskCard);

    });

    updateStats();
}

/* ================= STATS ================= */

function updateStats() {

    if (!totalTasks || !completedTasks || !pendingTasks) return;

    totalTasks.innerText = tasks.length;

    const completed = tasks.filter(task => task.completed).length;

    completedTasks.innerText = completed;

    pendingTasks.innerText = tasks.length - completed;
}

/* ================= TOGGLE COMPLETE ================= */

async function toggleComplete(id) {

    const token = localStorage.getItem("token");

    if (!token) {
        return alert("Login required");
    }

    const task = tasks.find(t => t._id === id);

    if (!task) return;

    try {

        await fetch(`${API_URL}/tasks/${id}`, {
            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify({
                completed: !task.completed
            })
        });

        await loadTasks();

    } catch (err) {

        console.log("Toggle error:", err);

    }
}

/* ================= DELETE TASK ================= */

async function deleteTask(id) {

    const token = localStorage.getItem("token");

    if (!token) {
        return alert("Login required");
    }

    try {

        await fetch(`${API_URL}/tasks/${id}`, {
            method: "DELETE",

            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        await loadTasks();

    } catch (err) {

        console.log("Delete error:", err);

    }
}

/* ================= MODAL ================= */

function openModal() {

    const modal = document.getElementById("taskModal");

    if (modal) {
        modal.style.display = "flex";
    }
}

function closeModal() {

    const modal = document.getElementById("taskModal");

    if (modal) {
        modal.style.display = "none";
    }
}

function outsideClick(e) {

    if (e.target.id === "taskModal") {
        closeModal();
    }
}

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {
        closeModal();
    }
});

/* ================= ADD TASK ================= */

async function submitModalTask(e) {

    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
        return alert("Login required");
    }

    const task = {

        title: document
            .getElementById("modalTitle")
            .value
            .trim(),

        description: document
            .getElementById("modalDescription")
            .value
            .trim(),

        dueDate: document
            .getElementById("modalDate")
            .value,

        priority: document
            .getElementById("modalPriority")
            .value,

        completed: false
    };

    try {

        const res = await fetch(`${API_URL}/tasks`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify(task)
        });

        const data = await res.json();

        tasks.unshift(data);

        renderTasks();

        e.target.reset();

        closeModal();

    } catch (err) {

        console.log("Add task error:", err);

    }
}