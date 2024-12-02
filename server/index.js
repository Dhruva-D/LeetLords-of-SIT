const express = require('express')
const { connectToMongoDB } = require('./connect')
const userRoute = require('./routes/user')

const app = express()
const PORT = 3000

connectToMongoDB("mongodb://localhost:27017/Leet-Lords")
.then(() => console.log("MongoDB connected"))

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use("/", userRoute)

app.listen(PORT, () => console.log(`Server Running on PORT ${PORT}`))