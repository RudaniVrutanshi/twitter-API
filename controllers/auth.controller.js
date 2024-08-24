import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { _id, fullName, username, email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username is already exists" });
    }
    const existingEmail = await User.findOne({ username });
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }
    //password security

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      _id,
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        // _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        // follower: newUser.followers,
        // following: newUser.following,
        // profileImg: newUser.profileImg,
        // coverImg: newUser.coverImg,
        password: newUser.password,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error is signup controller", error.message);
    res.status(500).json({ error: "Internal server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // if ((username = "" && password == "")) {
    //   return res.status(400).json({ error: "All filed is required.!" });
    // }

    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json("Login Successfully...");
  } catch (error) {
    console.log("Error is login controller", error.message);
    res.status(500).json({ error: "Internal server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json("Logged out Successfully...");
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal server Error" });
  }
};

export const getData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log("Error is getData controller", error.message);
    res.status(500).json({ error: "Internal server Error" });
  }
};
