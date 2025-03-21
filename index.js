require("dotenv").config();
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const path = require("path");

const app = express();
const port = 8080;

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
const sendEmail = require("./emailService");

app.use(express.json());
app.use(express.static(__dirname));

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
  }
}
connectDB();

const foodDB = client.db("Food_details");
const foodCollection = foodDB.collection("food_waste");

const userDB = client.db("User_details");
const usersCollection = userDB.collection("users");

// Pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "homepage.html"));
});
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "signup.html"));
});
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// Add food data
app.post("/add-data", async (req, res) => {
  try {
    const { foodItem, availability, expectedPeople, location, contact, emailVal } = req.body;

    if (!foodItem || !availability || !expectedPeople || !location || !contact || !emailVal) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const result = await foodCollection.insertOne({
      foodItem,
      availability,
      expectedPeople,
      location,
      contact,
      emailVal,
      createdAt: new Date()
    });

    const recipients = await usersCollection.find({ userTypes: { $in: ["user", "charity"] } }).toArray();

    const emailStatuses = [];

    for (let user of recipients) {
      const message = `Hey ${user.userName},\n\nNew food donation available!\n\nItem: ${foodItem}\nLocation: ${location}\nServes: ${expectedPeople} people\nContact: ${contact}\n\nHurry up and grab it!`;

      try {
        await sendEmail(user.email, "🍱 New Food Donation Available!", message);
        console.log(`📧 Email sent to: ${user.email}`);
        emailStatuses.push({ email: user.email, status: "Sent" });
      } catch (err) {
        console.error(`❌ Failed to send email to: ${user.email}`);
        emailStatuses.push({ email: user.email, status: "Failed" });
      }
    }

    res.status(201).json({
      message: "Food data added successfully and notifications sent",
      insertedId: result.insertedId,
      emailStatuses
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all available foods
app.get("/available-foods", async (req, res) => {
  try {
    const foods = await foodCollection.find({ accepted: { $ne: true } }).toArray();
    const formattedFoods = foods.map(food => ({
      ...food,
      _id: food._id.toString()
    }));
    res.json(formattedFoods);
  } catch (error) {
    console.error("Error fetching available foods:", error);
    res.status(500).json({ error: "Failed to fetch food data" });
  }
});

// Accept a food item
app.post("/accept-food", async (req, res) => {
  try {
    const { foodId, donorEmail, userName, userEmail } = req.body;

    if (!foodId || !donorEmail || !userName || !userEmail) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const result = await foodCollection.updateOne(
      { _id: new ObjectId(foodId) },
      { $set: { accepted: true, acceptedBy: userName, acceptedByEmail: userEmail, acceptedAt: new Date() } }
    );

    try {
      const message = `Hi, your food donation has been accepted by ${userName} (${userEmail}).\n\nThank you for contributing! 🙏`;
      await sendEmail(donorEmail, "🎉 Your Food Donation Has Been Accepted!", message);
      console.log(`📧 Acceptance email sent to donor: ${donorEmail}`);
    } catch (err) {
      console.error(`❌ Failed to send acceptance email to donor: ${donorEmail}`);
    }

    res.status(200).json({ message: "Food accepted and donor notified." });
  } catch (error) {
    console.error("Error accepting food:", error);
    res.status(500).json({ error: "Failed to accept food" });
  }
});

// Signup route
app.post("/signup", async (req, res) => {
  try {
    const { userName, email, userLocation, userTypes } = req.body;

    if (!userName || !email || !userLocation || !userTypes) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const result = await usersCollection.insertOne({
      userName,
      email,
      userLocation,
      userTypes
    });

    res.status(201).json({ message: "User signed up successfully", insertedId: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { email, userName } = req.body;

  if (!email || !userName) {
    return res.status(400).json({ error: "Email and Name are required" });
  }

  try {
    const user = await usersCollection.findOne({ email, userName });

    if (user) {
      res.status(200).json({ message: "Login Successful" });
    } else {
      res.status(401).json({ error: "Invalid Credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
