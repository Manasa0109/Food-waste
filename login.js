const loginButton = document.getElementById('loginButton');
loginButton.addEventListener('click', async () => {
    const email = document.getElementById('mail').value;
    const name = document.getElementById('name').value;

    if (!email || !name) {
        alert("Please enter both name and mail");
        return;
    }

    const loginData = {
        email,
        userName: name
    };

    try {
        const response = await fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });

        const result = await response.json();
        if (response.ok) {
            alert("Login Successfully");
            window.location.href = "/"; // Redirect after login
        } else {
            alert("Error: " + result.error);
        }
    } catch (error) {
        console.error("Login failed:", error);
        alert("Something went wrong.");
    }
});
