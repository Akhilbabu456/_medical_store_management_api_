const express= require("express")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const userRoutes = require("./routes/userRoutes")

const app = express()
dotenv.config()
connectDB()

app.use(express.json())

app.use("/api/", userRoutes)
app.use("/api/login", userRoutes)
app.use("/api/user", userRoutes)
app.use("/api/user/:id", userRoutes)
app.use("/api/user/search", userRoutes)


const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Listening to port ${PORT}`))

