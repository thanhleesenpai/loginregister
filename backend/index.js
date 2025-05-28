const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const authRoute = require("./routes/auth")
const userRoute = require("./routes/user")

dotenv.config()
const app = express()

app.use(cors())
app.use(cookieParser())
app.use(express.json())

//ROUTES
app.use("/v1/auth", authRoute)

app.use("/v1/user", userRoute)

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL)
    console.log("Connected to MongoDB")

    app.listen(8000, () => {
      console.log("Server started on port 8000")
    });
  } catch (err) {
    console.error("MongoDB connection error:", err)
  }
}

startServer()

//JSON WEB TOKEN

//AUTHENTICATION
//AUTHORIZATION
