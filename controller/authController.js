import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import passport from "passport";
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Create a new user instance
    const user = new User({ username, email, password });

    // Save the user to the database
    await user.save();

    // Sign a token with the user ID as payload
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // You can customize the expiration time
    });

    // Send the token and user details in the response
    return res
      .status(201)
      .json({ token, user: { _id: user._id, username, email } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Registration failed" });
  }
};

// export const login = (req, res) => {
//   passport.authenticate("local", { session: false }, (err, user) => {
//     if (err || !user) {
//       return res.status(401).json({ error: "Login failed" });
//     }

//     // Sign a token with the user ID as payload
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1h", // You can customize the expiration time
//     });

//     // Send the token and user details in the response
//     return res.json({
//       token,
//       user: { _id: user._id, username: user.username, email: user.email },
//     });
//   })(req, res);
// };
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email and password
    const user = await User.findOne({ email, password }).exec();

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // The user's role can be determined from the 'user' object
    const role = user.role;

    // Create a JWT with user information
    const token = jwt.sign({ user, role }, process.env.JWT_SECRET);

    return res.status(200).json({ token, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Login failed" });
  }
};

// controllers/userController.js

export const getUser = async (req, res) => {
  try {
    // Assuming you store user information in the request object after authentication
    const { user } = req;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userData = await User.findById(user._id).populate("sectors");

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      username: userData.username,
      email: userData.email,
      sectors: userData.sectors.map((sector) => sector._id),
      agreeToTerms: userData.agreeToTerms,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
