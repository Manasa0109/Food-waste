//get present user details fromlocalStorage
const userType = localStorage.getItem("userType");
const userName = localStorage.getItem("userName");
const userEmail = localStorage.getItem("userEmail");

fetch("http://localhost:8080/available-foods")
  .then(res => res.json())
  .then(data => {
    displayFoods(data);
  });

function displayFoods(foods) {
  const container = document.getElementById("food-list");
  container.innerHTML = "";

  foods.forEach(food => {
    const card = document.createElement("div");
    card.style.border = "1px solid #ccc";
    card.style.padding = "10px";
    card.style.marginBottom = "10px";
    card.innerHTML = `
      <h3>${food.foodItem}</h3>
      <p><strong>Location:</strong> ${food.location}</p>
      <p><strong>Available:</strong> ${food.availability} kg</p>
      <p><strong>Contact:</strong> ${food.contact}</p>
      <p><strong>Donor Email:</strong> ${food.emailVal}</p>
    `;

    const btn = document.createElement("button");
    btn.innerText = "Accept";
    btn.disabled = (userType === "donor");
    btn.onclick = () => acceptFood(food._id, food.emailVal);
    card.appendChild(btn);

    container.appendChild(card);
  });
}
function acceptFood(foodId, donorEmail, button) {
    fetch("http://localhost:8080/accept-food", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        foodId,
        donorEmail,
        userName,
        userEmail
      })
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      location.reload();
    })
    .catch(err => {
      console.error("Error accepting food:", err);
      alert("Failed to accept food");
      if (button) {
        button.disabled = false;
        button.innerText = "Accept";
      }
    });
  }
  
