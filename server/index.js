const express = require('express')
const { connectToMongoDB } = require('./connect')
const userRoute = require('./routes/user')
const leaderboardRoute = require('./routes/leaderboard')
const path = require('path');


const app = express()
const PORT = 5000

connectToMongoDB("mongodb://localhost:27017/Leet-Lords")
.then(() => console.log("MongoDB connected"))

app.set("view engine" , "ejs")
app.set("views" , path.resolve("./views"))


app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use("/register", userRoute)
app.use("/", leaderboardRoute)

app.listen(PORT, () => console.log(`Server Running on PORT ${PORT}`))