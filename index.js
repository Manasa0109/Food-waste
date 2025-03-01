require("dotenv").config();
const {MongoClient}=require("mongodb");
const express=require("express");
const uri=process.env.MONGO_URI;
const client=new MongoClient(uri);
const app=express();
const path = require("path");
const port=8080;
app.use(express.json());
app.use(express.static(__dirname));
async function connectDB(){
    try{
        await client.connect();
        console.log("Connected");
        
    }
    catch(error){
        console.log(error);
    }
}
connectDB();
const database=client.db("Food_details");
const dashboardCollection=database.collection("food_waste");
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "homepage.html"));
});
app.post("/add-data",async(req,res)=>{
    try{
        console.log("Received Data:", req.body);
        const {foodItem,
            availability,
            expectedPeople,
            location,
            contact,
            emailVal}=req.body;
            if (!foodItem || !availability || !expectedPeople || !location || !contact || !emailVal) {
                return res.status(400).json({ error: "All fields are required" });
            }
        const result=await dashboardCollection.insertOne({
            foodItem,
            availability,
            expectedPeople,
            location,
            contact,
            emailVal
        });
        res.status(201).json({message:"data added succesfully",insertedId:result.insertedId});
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
});
app.listen(port,()=>{
    console.log(`server running at http://localhost:${port}`);
});