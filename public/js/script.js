document.addEventListener("DOMContentLoaded", function () {
    const registerButton = document.getElementById("registerBtn");
    const loginButton = document.getElementById("loginBtn");
    function sendRequest(endpoint, data) {
        fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(data)
        })
            .then(response => {
                console.log(response);
                if (response.redirected) {
                    window.location.href = response.url;
                }
                else if (response.status === 200) {
                    return response.json().then(data => {
                        Swal.fire({
                            icon: data.success ? "success" : "error",
                            title: data.success ? "Success!" : "Oops...",
                            text: data.message,
                            confirmButtonText: "OK"
                        })
                    })
                }
            })
            .catch(error => console.error("Error:", error));
    }
    if (registerButton) {
        registerButton.addEventListener("click", (e) => {
            e.preventDefault();
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const confirmEmail = document.getElementById("confirmEmail").value.trim();
            const password = document.getElementById("password").value.trim();
            let errors = [];
            if (!name) {
                errors.push("Full Name is required.");
            }
            if (!validateEmail(email)) {
                errors.push("Enter a valid email address.");
            }
            if (email !== confirmEmail) {
                errors.push("Email and Confirm Email are not same.");
            }
            if (password.length < 6) {
                errors.push("Password must be at least 6 characters long.");
            }
            if (errors.length > 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    html: errors.join('<br>'),
                    confirmButtonText: 'OK'
                });
            } else {
                sendRequest("/register", { username: email, password });
            }
        });
    }
    if (loginButton) {
        loginButton.addEventListener("click", (e) => {
            e.preventDefault();
            const username = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();
            if (!username || !password) {
                Swal.fire({
                    icon: "error",
                    title: "Missing Fields",
                    text: "Please fill in both email and password.",
                });
                return;
            }
            if (!validateEmail(username)) {
                Swal.fire({
                    icon: "error",
                    title: "Invalid Email",
                    text: "Please enter a valid email address.",
                });
                return;
            }
            if (password.length < 6) {
                Swal.fire({
                    icon: "error",
                    title: "Weak Password",
                    text: "Password must be at least 6 characters long.",
                });
                return;
            }
            sendRequest("/login", { username, password });
        });
    }
    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
});