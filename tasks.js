const API = "https://tasker-backend-92ol.onrender.com/api/tasks";

/* ================= ELEMENTS ================= */

const taskContainer = document.getElementById("taskContainer");
const taskForm = document.getElementById("taskForm");

const modal = document.getElementById("taskModal");

const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");

const searchTask = document.getElementById("searchTask");
const filterPriority = document.getElementById("filterPriority");


/* ================= AUTH CHECK ================= */

const token = localStorage.getItem("token");

if (!token) {

    alert("Please login first");

    window.location.href = "login.html";
}


/* ================= AUTH HEADER ================= */

function authHeader() {

    return {

        "Content-Type": "application/json",

        "Authorization": `Bearer ${token}`

    };
}


/* ================= MODAL ================= */

openModal.addEventListener("click", () => {

    modal.style.display = "flex";

});

closeModal.addEventListener("click", () => {

    modal.style.display = "none";

});

window.addEventListener("click", (e) => {

    if (e.target === modal) {

        modal.style.display = "none";
    }
});


/* ================= GET TASKS ================= */

async function getTasks() {

    try {

        const res = await fetch(API, {

            headers: authHeader()

        });

        return await res.json();

    } catch (err) {

        console.log("Get tasks error:", err);

        return [];
    }
}


/* ================= CREATE TASK ================= */

async function createTask(task) {

    try {

        const res = await fetch(API, {

            method: "POST",

            headers: authHeader(),

            body: JSON.stringify(task)

        });

        return await res.json();

    } catch (err) {

        console.log("Create task error:", err);
    }
}


/* ================= DELETE TASK ================= */

async function deleteTask(id) {

    try {

        await fetch(`${API}/${id}`, {

            method: "DELETE",

            headers: authHeader()

        });

        loadTasks();

    } catch (err) {

        console.log("Delete task error:", err);
    }
}


/* ================= TOGGLE COMPLETE ================= */

async function toggleComplete(id, current) {

    try {

        await fetch(`${API}/${id}`, {

            method: "PUT",

            headers: authHeader(),

            body: JSON.stringify({

                completed: !current

            })
        });

        loadTasks();

    } catch (err) {

        console.log("Toggle error:", err);
    }
}


/* ================= LOAD TASKS ================= */

async function loadTasks() {

    const tasks = await getTasks();

    renderTasks(tasks);
}


/* ================= RENDER TASKS ================= */

function renderTasks(taskList) {

    taskContainer.innerHTML = "";

    if (!taskList || taskList.length === 0) {

        taskContainer.innerHTML = `
            <h3 style="text-align:center;">
                No Tasks Found
            </h3>
        `;

        return;
    }

    taskList.forEach(task => {

        const card = document.createElement("div");

        card.classList.add("task-card");

        card.innerHTML = `

            <h3>${task.title}</h3>

            <p>${task.description}</p>

            <p class="task-date">
                Due Date:
                ${
                    task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "No date"
                }
            </p>

            <div class="task-info">

                <span class="priority ${task.priority.toLowerCase()}">

                    ${task.priority}

                </span>

            </div>

            <div class="task-actions">

                <button
                    class="complete-btn"
                    onclick="toggleComplete('${task._id}', ${task.completed})"
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

            card.style.opacity = "0.6";
        }

        taskContainer.appendChild(card);
    });
}


/* ================= FORM SUBMIT ================= */

taskForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const task = {

        title: document.getElementById("taskTitle").value,

        description: document.getElementById("taskDescription").value,

        dueDate: document.getElementById("taskDate").value,

        priority: document.getElementById("taskPriority").value

    };

    await createTask(task);

    taskForm.reset();

    modal.style.display = "none";

    loadTasks();
});


/* ================= SEARCH ================= */

searchTask.addEventListener("keyup", async () => {

    const tasks = await getTasks();

    const value = searchTask.value.toLowerCase();

    const filtered = tasks.filter(task =>

        task.title.toLowerCase().includes(value)
    );

    renderTasks(filtered);
});


/* ================= FILTER PRIORITY ================= */

filterPriority.addEventListener("change", async () => {

    const tasks = await getTasks();

    const value = filterPriority.value;

    if (value === "All") {

        renderTasks(tasks);

        return;
    }

    const filtered = tasks.filter(task =>

        task.priority === value
    );

    renderTasks(filtered);
});


/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", loadTasks);


/* ================= GLOBAL ACCESS ================= */

window.deleteTask = deleteTask;

window.toggleComplete = toggleComplete;