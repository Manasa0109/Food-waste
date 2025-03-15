const saveButton = document.getElementById('saveButton');

saveButton.addEventListener('click', async()=> {
    

    const userName = document.getElementById('name').value;
    const email = document.getElementById('usermail').value;
    const userLocation = document.getElementById('location').value;

    const checkboxes = document.querySelectorAll('input[name="type"]:checked'); // ✅ fixed
    const userTypes = Array.from(checkboxes).map(cb => cb.value);

    if (!userName || !email || !userLocation || userTypes.length === 0) {
        alert("Please fill all fields");
        return;
    }

    const userData = {
        userName,
        email,
        userLocation,
        userTypes
    };

    try {
        const response = await fetch('http://localhost:8080/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (response.ok) {
            alert("Signup successful!");
            window.location.href="/";
        } else {
            alert("Error: " + result.error);
        }
    } catch (err) {
        console.error(err);
        alert("Something went wrong.");
    }
});
 