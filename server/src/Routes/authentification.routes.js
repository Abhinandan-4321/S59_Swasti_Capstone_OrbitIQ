const express = require("express");
const router = express.Router();
const User = require("../Model/user_schema");
const { ValidateUserSchema } = require("../Model/joi_schema");

router.post("/checkpassword/:id", async (req, res) => {
  const  {OldPass}  = req.body;
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const isPasswordMatch = OldPass === user.Password;
    return res.status(200).json({ isPasswordMatch });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.patch("/changeUserData/:id", async (req, res) => {
  try {
    const changedUserData = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!changedUserData) {
      return res.status(404).send("User not found");
    }
    res.json(changedUserData);
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
})

router.get("/", async (req, res) => {
  try {
    const user = await User.find();
    res.json(user);
  }
  catch (error) {
    res.status(400).json({ error: "Cannot get the User data" + error })
  }
});

router.post("/login", async (req, res) => {
  const { Email, Password } = req.body;
  try {
    const user = await User.findOne({ Email: Email, Password: Password });
    if (user) {
      const { Username } = user;
      res.status(200).json({ message: "Login successful", Username: Username, UserId: user._id });
    }
    else {
      res.status(401).json({ message: "Check your Email and Password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error:Login failed" });
  }
});

router.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logout successful" });
});

router.post("/signup", async (req, res) => {
  const { Username, Email, Password } = req.body;
  try {
    const { error } = ValidateUserSchema(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const exist = await User.findOne({ Email });
    if (exist) {
      res.status(400).json({ message: "User already registered" });
    } else {
      const User_Added = new User({
        Username,
        Email,
        Password
      });
      const savedUser = await User_Added.save();
      res.status(201).json({ data: savedUser, message: "User added successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;