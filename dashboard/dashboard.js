const addButton = document.getElementById('add-food');
const formContainer = document.getElementById('form-container');
let saveButton;

addButton.addEventListener('click', () => {
    formContainer.style.display = 'block';
    formContainer.innerHTML = '';
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

        saveButton.addEventListener('click', async() => {
            const foodItem=foodArea.value;
            const availability=foodAvail.value;
            const expectedPeople=people.value;
            const locationValue=location.value;
            const contactNum=phnNumber.value;
            const emailVal=mail.value;
            if(!foodItem||!foodAvail||!expectedPeople||!locationValue||!contactNum||!emailVal){
                alert("Please fill all fields");
                return;
            }
            const foodData={
                foodItem,
                availability:parseInt(availability),
                expectedPeople:parseInt(expectedPeople),
                location:locationValue,
                contact:contactNum,
                emailVal
            };
            try{
                const response=await fetch("http://localhost:3000/add-data",{
                method:"POST",
                headers: {"Content-Type":"application/json"},
                body:JSON.stringify(foodData)

            });
            const result=await response.json();
            if(response.ok){
                alert("Saved");
                formContainer.style.display="none";
            }
            else{
                alert("error"+result.error);

            }
        }catch(error){
                console.log("error");
                alert("failed to save data");
            }
        });
    }
});
