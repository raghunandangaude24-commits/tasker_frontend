const API = "https://tasker-backend-92ol.onrender.com/api/user/settings";


/* ================= AUTH ================= */

const token = localStorage.getItem("token");

if (!token) {

    alert("Please login first");

    window.location.href = "login.html";
}


/* ================= ELEMENTS ================= */

const settingsForm = document.querySelector("form");

const nameInput =
    document.querySelector("input[type='text']");

const emailInput =
    document.querySelector("input[type='email']");

const passwordInput =
    document.querySelector("input[type='password']");

const checkboxes =
    document.querySelectorAll("input[type='checkbox']");

const emailNotifications = checkboxes[0];

const taskReminders = checkboxes[1];

const popup = document.getElementById("popup");

const popupTitle = document.getElementById("popupTitle");

const popupMessage = document.getElementById("popupMessage");


/* ================= POPUP ================= */

function showPopup(title, message) {

    popupTitle.innerText = title;

    popupMessage.innerText = message;

    popup.classList.add("show");

    setTimeout(() => {

        popup.classList.remove("show");

    }, 3000);
}


/* ================= AUTH HEADER ================= */

function authHeader() {

    return {

        "Content-Type": "application/json",

        "Authorization": `Bearer ${token}`
    };
}


/* ================= LOAD SETTINGS ================= */

async function loadSettings() {

    try {

        const res = await fetch(API, {

            headers: authHeader()
        });

        const user = await res.json();


        // IMPORTANT FIX
        nameInput.value = user.username || "";

        emailInput.value = user.email || "";


        emailNotifications.checked =
            user.emailNotifications ?? true;

        taskReminders.checked =
            user.taskReminders ?? true;

    } catch (err) {

        console.log(err);
    }
}


/* ================= SAVE SETTINGS ================= */

settingsForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        const res = await fetch(API, {

            method: "PUT",

            headers: authHeader(),

            body: JSON.stringify({

                // IMPORTANT FIX
                username: nameInput.value,

                email: emailInput.value,

                password: passwordInput.value,

                emailNotifications:
                    emailNotifications.checked,

                taskReminders:
                    taskReminders.checked

            })
        });

        const data = await res.json();


        // IMPORTANT FIX
        localStorage.setItem(
            "username",
            nameInput.value
        );


        showPopup(

            "Success",

            data.message || "Settings updated"
        );

        passwordInput.value = "";

    } catch (err) {

        console.log(err);

        showPopup(

            "Error",

            "Failed to update settings"
        );
    }
});


/* ================= INIT ================= */

document.addEventListener(

    "DOMContentLoaded",

    loadSettings
);