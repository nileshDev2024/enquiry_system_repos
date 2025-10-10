// const bcrypt = require("bcrypt");
// const User = require("../Models/User");

// // Only Super Admin can create Admin or HR
// const createAdminOrHR = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     // Check if logged-in user is super-admin
//     if (!req.user || req.user.role !== "super-admin") {
//       return res.status(403).json({ msg: "Only Super Admin can create admin or HR" });
//     }

//     // Allow only "admin" or "HR"
//     if (!["admin", "HR"].includes(role)) {
//       return res.status(400).json({ msg: "Role must be admin or HR" });
//     }

//     // Check if email already exists
//     const existing = await User.findOne({ email });
//     if (existing) {
//       return res.status(400).json({ msg: "Email already exists" });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new Admin/HR
//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//       isVerified: true, // since Super Admin is creating, mark verified
//     });

//     await newUser.save();

//     res.json({ msg: `${role} created successfully` });
//   } catch (err) {
//     res.status(500).json({ msg: "Error creating user", error: err.message });
//   }
// };

// module.exports = { createAdminOrHR };


const bcrypt = require("bcrypt");
const User = require("../Models/User");
const jwt = require("jsonwebtoken");

// Only Super Admin can create Admin or HR
const createAdminOrHR = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Only allow admin or HR
    if (!["admin", "HR"].includes(role)) return res.status(400).json({ msg: "Invalid role" });

    // Only Super Admin can create
    if (!req.user || req.user.role !== "super-admin") {
      return res.status(403).json({ msg: "Only Super Admin can create Admin or HR" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      isVerified: true,
    });

    await newUser.save();

    // Generate token using same secret
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ msg: `${role} created successfully`, user: { name, email, role }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error creating user", error: err.message });
  }
};

module.exports = { createAdminOrHR };
