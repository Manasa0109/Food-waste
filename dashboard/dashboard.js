const addButton = document.getElementById('add-food');
const formContainer = document.getElementById('form-container');
let saveButton;

addButton.addEventListener('click', () => {
    formContainer.style.display = 'block';

    // Clear previous form to avoid duplication
    formContainer.innerHTML = '';

    // Create and append form fields
    const foodArea = document.createElement('textarea');
    foodArea.placeholder = 'Enter food item';
    formContainer.appendChild(foodArea);

    const foodAvail = document.createElement('input');
    foodAvail.type = 'number';
    foodAvail.placeholder = 'Availability in kgs';
    formContainer.appendChild(foodAvail);

    const people = document.createElement('input');
    people.type = 'number';
    people.placeholder = 'Expected number of people to eat';
    formContainer.appendChild(people);

    const location = document.createElement('input');
    location.placeholder = 'Location';
    formContainer.appendChild(location);

    const phnNumber = document.createElement('input');
    phnNumber.type = 'number';
    phnNumber.placeholder = 'Contact';
    formContainer.appendChild(phnNumber);

    const mail = document.createElement('input');
    mail.type = 'email';
    mail.placeholder = 'Enter your email';
    formContainer.appendChild(mail);

    // Create the save button
    if (!saveButton) {
        saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.className = 'save-btn';
        formContainer.appendChild(saveButton);

        saveButton.addEventListener('click', () => {
            alert('Food contribution saved successfully!');
            formContainer.style.display = 'none';
        });
    }
});
