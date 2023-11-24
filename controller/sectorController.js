import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Sector from "../models/sectorModel.js";
import User from "../models/userModel.js";

// Save selected sectors
// Save selected sectors
// export const saveSetor = async (req, res) => {
//   const { name, sectors } = req.body;

//   try {
//     // Create a new instance of the Sector model for each selected sector
//     const sectorObjects = sectors.map((sectorName) => ({ name, sectorName }));

//     // Save the sectors to the database
//     const savedSectors = await Sector.create(sectorObjects);

//     res.json(savedSectors);
//   } catch (error) {
//     console.error("Error saving sectors:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
// Save selected sectors with associated users
export const saveSetor = async (req, res) => {
  try {
    const { name, userIds } = req.body;

    // Create a new sector instance
    const sector = new Sector({ name, users: userIds });

    // Save the sector to the database
    await sector.save();

    res.status(201).json(sector);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save sector" });
  }
};

// Fetch all sectors
// Fetch all sectors with associated user data
export const getAllSectors = async (req, res) => {
  try {
    const sectorsWithUsers = await Sector.find().populate("users", "name");
    res.json(sectorsWithUsers);
  } catch (error) {
    console.error("Error fetching sectors:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// Add a user to a sector
export const addUsertoSector = async (req, res) => {
  try {
    const { username, email, selectedSectors } = req.body; // Change sectorId to selectedSectors
    console.log("Received username:", username);
    console.log("Received email:", email);

    // Find the existing user by username and email
    const existingUser = await User.findOne({ username, email });

    if (!existingUser) {
      // If the user doesn't exist, handle the situation accordingly
      return res.status(404).json({ error: "User not found" });
    }

    // Add the user to the specified sectors
    const updatedSectors = await Promise.all(
      selectedSectors.map(async (sectorId) => {
        const updatedSector = await Sector.findByIdAndUpdate(
          sectorId,
          { $addToSet: { users: existingUser._id } },
          { new: true }
        );

        // Update the user with the associated sectors
        await User.findByIdAndUpdate(existingUser._id, {
          $addToSet: { sectors: sectorId },
        });

        return updatedSector;
      })
    );

    res.status(201).json({ user: existingUser, sectors: updatedSectors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add user to sector" });
  }
};

// sectorController.js

export const getUsersInSector = async (req, res) => {
  try {
    const { sectorId } = req.params;

    // Find the sector by ID and populate the 'users' field
    const sectorWithUsers = await Sector.findById(sectorId).populate("users");

    if (!sectorWithUsers) {
      return res.status(404).json({ error: "Sector not found" });
    }

    // Extract and send the users data
    const usersInSector = sectorWithUsers.users;
    res.json(usersInSector);
  } catch (error) {
    console.error("Error fetching users in sector:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Example endpoint to update a sector
export const updateSector = async (req, res) => {
  const { sectorId } = req.params;
  const { name } = req.body;

  try {
    // Check if the user is allowed to edit this sector
    const sector = await Sector.findOne({
      _id: sectorId,
      users: req.user.userId,
    });

    if (!sector) {
      return res
        .status(403)
        .json({ error: "You do not have permission to edit this sector" });
    }

    // Update the sector data
    sector.name = name;
    await sector.save();

    res.json(sector);
  } catch (error) {
    console.error("Error updating sector:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getSectorById = async (req, res) => {
  const { sectorId } = req.params;

  try {
    const sector = await Sector.findById(sectorId);

    if (!sector) {
      return res.status(404).json({ error: "Sector not found" });
    }

    res.json(sector);
  } catch (error) {
    console.error("Error fetching sector:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// controllers/userController.js

export const updateUser = async (req, res) => {
  try {
    const { username, email } = req.body;
    console.log("Decoded User ID:", req.user._id); // Log decoded user ID

    // Assuming you store user information in the request object after authentication
    const { user } = req;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Find the existing user by ID
    const existingUser = await User.findById(user._id);

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user data
    existingUser.username = username;
    existingUser.email = email;
    await existingUser.save();

    res.status(200).json({
      username: existingUser.username,
      email: existingUser.email,
      sectors: existingUser.sectors.map((sector) => sector._id),
      agreeToTerms: existingUser.agreeToTerms,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
