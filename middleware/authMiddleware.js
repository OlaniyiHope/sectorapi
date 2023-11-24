// import jwt from "jsonwebtoken";

// const authenticateUser = (req, res, next) => {
//   const token = req.headers.authorization;
//   console.log("Received token:", token);

//   if (!token || !token.startsWith("Bearer ")) {
//     // Check for 'Bearer ' prefix
//     console.log("Unauthorized - Token missing or invalid format");
//     return res.status(401).json({ error: "Unauthorized" });
//   }

//   try {
//     const decodedToken = jwt.verify(
//       token.replace("Bearer ", ""),
//       process.env.JWT_SECRET
//     );
//     console.log("Decoded Token:", decodedToken);

//     // Check if the token payload includes the 'userId' or 'user' property
//     const userId =
//       decodedToken.userId || (decodedToken.user && decodedToken.user._id);
//     if (!userId) {
//       console.log("Unauthorized - User ID not found in token");
//       return res.status(403).json({ error: "User ID not found in token" });
//     }

//     req.user = { userId }; // Ensure consistency by always using 'userId'

//     next();
//   } catch (error) {
//     console.log("Unauthorized - Invalid token");
//     return res.status(401).json({ error: "Invalid token" });
//   }
// };
// export default authenticateUser;
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );

    req.user = decoded.user;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(401).json({ error: "Token is not valid" });
  }
};

export default authenticateUser;
