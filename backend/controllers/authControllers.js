const User = require("../models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { request } = require("express")

let refreshTokens = []
const authController = {
  // REGISTER
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10)
      const hashed = await bcrypt.hash(req.body.password, salt)
      
      // Create a new user
      const newUser = await new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
      })

      // Save to DB
      const user = await newUser.save()
      res.status(200).json(user)
    } catch (error) {
      res.status(500).json(error)
    }
  },
  // GENERATE ACCESS TOKEN
  generateAccessToken: (user) => {
    return jwt.sign({ id: user._id, admin: user.admin }, process.env.JWT_ACCESS_KEY, {
      expiresIn: "20s"
    })
  },
  // GENERATE REFRESH TOKEN
  generateRefreshToken: (user) => {
    return jwt.sign({ id: user._id, admin: user.admin }, process.env.JWT_REFRESH_KEY, {
      expiresIn: "365d"
    })
  },
  // LOGIN
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username })
      if (!user) return res.status(404).json({message: "User not found"})
      const validPassword = await bcrypt.compare(req.body.password, user.password)
      if (!validPassword) return res.status(400).json({message: "Wrong Username or Password"})
      if(user && validPassword) {
        const accessToken = authController.generateAccessToken(user)
        const refreshToken = authController.generateRefreshToken(user)
        refreshTokens.push(refreshToken)
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          path:"/",
          sameSite: "strict",
        })
        const { password, ...others } = user._doc
        res.status(200).json({...others, accessToken})
      }
    } catch (error) {
      res.status(500).json(error)
      
    }
  },

  // REFRESH TOKEN
  requestRefreshToken: async (req, res) => {
    // Take the refresh token from the user
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) res.status(401).json({message: "You are not authenticated!"})
    if (!refreshTokens.includes(refreshToken)) res.status(403).json({message: "Refresh token is not valid!"})
    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        console.log(err)
      }
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken)
      // Create new access token, generate new refresh token
      const newAccessToken = authController.generateAccessToken(user)
      const newRefreshToken = authController.generateRefreshToken(user)
      refreshTokens.push(newRefreshToken)
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path:"/",
        sameSite: "strict",
      })
      res.status(200).json({ accessToken: newAccessToken })
    })
  },
  // LOGOUT
  userLogout: async (req, res) => {
    // Clear the refresh token from the cookie
    res.clearCookie("refreshToken")
    refreshTokens = refreshTokens.filter((token) => token !== req.cookies.refreshToken)
    res.status(200).json({message: "Logged out successfully"})
  }
}

// STORE TOKEN
// 1) LOCAL STORAGE:
//XSS
// 2) COOKIES:
// CSRF -> SameSite
// 3) REDUX STORE -> ACCESS TOKEN
// HTTPONLY COOKIES -> REFRESH TOKEN

module.exports = authController