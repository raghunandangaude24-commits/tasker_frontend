const API_URL = "https://tasker-backend-92ol.onrender.com/api";

/* ================= MESSAGE ================= */

function showMsg(text, color = "red") {
    const msg = document.getElementById("msg");
    msg.innerText = text;
    msg.style.color = color;
}

/* ================= SIGNUP ================= */

async function signup() {

    const username = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!username || !email || !password) {
        showMsg("Please fill all fields");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            showMsg(data.message || "Signup failed");
            return;
        }

        showMsg("Account created successfully!", "green");

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);

    } catch (err) {
        console.log(err);
        showMsg("Server error");
    }
}

/* ================= LOGIN ================= */

async function login() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        showMsg("Please fill all fields");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            showMsg(data.message || "Invalid credentials");
            return;
        }

        // SAVE REAL DATA FROM BACKEND
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);

        showMsg("Login successful!", "green");

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);

    } catch (err) {
        console.log(err);
        showMsg("Server error");
    }
}

/* ================= LOGOUT ================= */

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "login.html";
}