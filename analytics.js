const API = "https://tasker-backend-92ol.onrender.com/api/tasks";


/* ================= AUTH ================= */

const token = localStorage.getItem("token");

if (!token) {

    alert("Please login first");

    window.location.href = "login.html";
}


/* ================= ELEMENTS ================= */

const totalTasks = document.getElementById("totalTasks");

const completedTasks = document.getElementById("completedTasks");

const pendingTasks = document.getElementById("pendingTasks");

const progressPercent = document.getElementById("progressPercent");

const progressFill = document.querySelector(".progress-fill");

const activityList = document.querySelector(".activity-list");


/* ================= AUTH HEADER ================= */

function authHeader() {

    return {

        "Content-Type": "application/json",

        "Authorization": `Bearer ${token}`
    };
}


/* ================= GET TASKS ================= */

async function getTasks() {

    try {

        const res = await fetch(API, {

            headers: authHeader()
        });

        return await res.json();

    } catch (err) {

        console.log("Analytics fetch error:", err);

        return [];
    }
}


/* ================= LOAD ANALYTICS ================= */

async function loadAnalytics() {

    const tasks = await getTasks();

    const total = tasks.length;

    const completed = tasks.filter(task => task.completed).length;

    const pending = total - completed;

    const productivity = total > 0

        ? Math.round((completed / total) * 100)

        : 0;


    /* ===== UPDATE CARDS ===== */

    totalTasks.innerText = total;

    completedTasks.innerText = completed;

    pendingTasks.innerText = pending;

    progressPercent.innerText = `${productivity}%`;

    progressFill.style.width = `${productivity}%`;


    /* ===== UPDATE TEXT ===== */

    const progressText = document.querySelector(".progress-text");

    progressText.innerText = `
        You completed ${productivity}% of your tasks.
    `;


    /* ===== RECENT ACTIVITY ===== */

    activityList.innerHTML = "";

    if (tasks.length === 0) {

        activityList.innerHTML = `
            <div class="activity-card">
                No recent activity
            </div>
        `;

        return;
    }


    /* SHOW LATEST 5 TASKS */

    tasks.slice(0, 5).forEach(task => {

        const activityCard = document.createElement("div");

        activityCard.classList.add("activity-card");


        activityCard.innerHTML = `

            <i class="fa-solid ${
                task.completed
                    ? "fa-check"
                    : "fa-plus"
            }"></i>

            ${
                task.completed
                    ? "Completed"
                    : "Added"
            }

            "${task.title}"

        `;

        activityList.appendChild(activityCard);
    });
}


/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", loadAnalytics);