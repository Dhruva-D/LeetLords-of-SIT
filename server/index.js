const express = require('express');
const { connectToMongoDB } = require('./connect');
const userRoute = require('./routes/user');
const leaderboardRoute = require('./routes/leaderboard');
const path = require('path');

const app = express();
const PORT = 5000;

connectToMongoDB("mongodb+srv://Dhruva:8UyTM-vwSQaqAtP@cluster0.r5dk3.mongodb.net/leetlords?retryWrites=true&w=majority&appName=Cluster0")
.then( () => console.log("Connected to MongoDB")).catch((err) => console.log('error', err))

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/register", userRoute);
app.use("/", leaderboardRoute);

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
