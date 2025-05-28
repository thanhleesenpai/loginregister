const User = require("../models/User")

const userController = {
  //GET ALL USERS
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find()
      return res.status(200).json(users)
      return res.status(200).json(users)
    } catch (error) {
      return res.status(500).json(error)
    }
  },

  //DELETE USER
  // deleteUser: async (req, res) => {
  //   try {
  //     const user = await User.findById(req.params.id)
  //     return res.status(200).json("Delete successfully")
  //   } catch (error) {
  //     return res.status(500).json(error)
  //   }
  // }
  deleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id)
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ message: "Delete successfully" })
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error })
    }
  }
}

module.exports = userController