require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");
const path = require("path");

const app = express();
const port = 8080;

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

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

// Route: Homepage (for food data entry)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "homepage.html"));
});

// Route: Signup Page
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "signup.html"));
});
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});


// 🔽 POST: Store Food Waste Data
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
      emailVal
    });

    res.status(201).json({ message: "Food data added successfully", insertedId: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔽 POST: Store User Signup Data
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

app.post("/login",async(req,res)=>{
  const {email,userName}=req.body;
  if(!email||!userName){
    return res.status(400).json({error:"Email and Name are required"});
  }
  try{
    const user=await usersCollection.findOne({email,userName});
    if(user){
      res.status(200).json({message:"Login Successful"});
    }else{
      res.status(401).json({message:"Login Successful"});
    }
  }
  catch(error){
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
