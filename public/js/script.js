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
                    if (response.status === 200 && endpoint === '/login') {
                        return response.json().then(data => {
                            Swal.fire({
                                icon: data.success ? "success" : "error",
                                title: data.success ? "Success!" : "Oops...",
                                text: data.message,
                                confirmButtonText: "OK"
                            }).then(() => {
                                if (data.success) {
                                    window.location.href = "/";
                                }
                            });
                        });
                    } else if (response.status === 200 && endpoint === '/register') {
                        return response.json().then(data => {
                            Swal.fire({
                                icon: data.success ? "success" : "error",
                                title: data.success ? "Success!" : "Oops...",
                                text: data.message,
                                confirmButtonText: "OK"
                            }).then(() => {
                                if (data.success) {
                                    window.location.href = "/login";
                                }
                            });
                        });
                    }
                })
                .catch(error => console.error("Error:", error));
        }
        function validateEmail(email) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        }
        function validatePassword(password) {
            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
            return regex.test(password);
        }
        function validateInputs(inputs) {
            let errors = [];
            if (!inputs.name) {
                errors.push("Full Name is required.");
            }
            if (!validateEmail(inputs.email)) {
                errors.push("Enter a valid email address.");
            }
            if (inputs.email !== inputs.confirmEmail) {
                errors.push("Email and Confirm Email do not match.");
            }
            if (!validatePassword(inputs.password)) {
                errors.push("Password must be at least 8 characters long and include a capital letter, lowercase letter, and special character.");
            }
            return errors;
        }
        if (registerButton) {
            registerButton.addEventListener("click", (e) => {
                e.preventDefault();
                const inputs = {
                    name: document.getElementById("name").value.trim(),
                    email: document.getElementById("email").value.trim(),
                    confirmEmail: document.getElementById("confirmEmail").value.trim(),
                    password: document.getElementById("password").value.trim()
                };
                let errors = validateInputs(inputs);
                if (errors.length > 0) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        html: errors.join('<br>'),
                        confirmButtonText: 'OK'
                    });
                } else {
                    sendRequest("/register", { username: inputs.email, password: inputs.password });
                }
            });
        }
        if (loginButton) {
            loginButton.addEventListener("click", (e) => {
                e.preventDefault();
                const username = document.getElementById("email").value.trim();
                const password = document.getElementById("password").value.trim();
                let errors = [];
                if (!username || !password) {
                    errors.push("Username and password is required.");
                }
                if (errors.length > 0) {
                    Swal.fire({
                        icon: "error",
                        title: "Validation Error",
                        html: errors.join('<br>'),
                        confirmButtonText: "OK"
                    });
                } else {
                    sendRequest("/login", { username, password });
                }
            });
        }
    });