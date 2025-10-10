const Admission = require("../Models/admissionModule");
const Enquiry = require("../Models/enquiryModule");
const Registration = require("../Models/registationModule");

// User own data 
exports.getUserData = async (req, res) => {
  try {
    const userId = req.user._id;

    const admission = await Admission.find({ userId})
    // .select("_id fullName phone email course payment  ")
    
    const enquiry = await Enquiry.find({ userId });
    const registration = await Registration.find({ userId });

    res.json({ admission, enquiry, registration });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching user data", error: err.message });
  }
};

// 2️⃣ HR data (without installments)
exports.getHRData = async (req, res) => {
  try {
    const admission = await Admission.find({}, "-installment"); // exclude installment
    const enquiry = await Enquiry.find();
    const registration = await Registration.find();

    res.json({ admission, enquiry, registration });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching HR data", error: err.message });
  }
};

// 3️⃣ Admin / Super Admin data (full access)
exports.getAllData = async (req, res) => {
  try {
    const admission = await Admission.find();
    const enquiry = await Enquiry.find();
    const registration = await Registration.find();

    res.json({ admission, enquiry, registration });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching all data", error: err.message });
  }
};

// 4️⃣ Notification after every 50 admissions
exports.checkNotification = async (req, res) => {
  try {
    const count = await Admission.countDocuments();
    if (count % 50 === 0 && count > 0) {
      return res.json({ notify: true, msg: `🎉 ${count} admissions completed!` });
    }
    res.json({ notify: false, count });
  } catch (err) {
    res.status(500).json({ msg: "Error checking notifications", error: err.message });
  }
};


// Helper to get correct model
const getModel = (module) => {
  switch (module) {
    case "admission":
      return Admission;
    case "registration":
      return Registration;
    case "enquiry":
      return Enquiry;
    default:
      return null;
  }
};

// ---------- Update ----------
exports.updateData = async (req, res) => {
  try {
    const { module, id } = req.params;
    const updateData = req.body;
    updateData.updatedBy = req.user._id;
    updateData.updatedAt = new Date();

    const Model = getModel(module);
    if (!Model) return res.status(400).json({ msg: "Invalid module" });

    const updated = await Model.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ msg: "Record not found" });

    res.json({ msg: "Record updated successfully", data: updated });
  } catch (err) {
    res.status(500).json({ msg: "Error updating data", error: err.message });
  }
};

// ---------- Delete ----------
exports.deleteData = async (req, res) => {
  try {
    const { module, id } = req.params;

    const Model = getModel(module);
    if (!Model) return res.status(400).json({ msg: "Invalid module" });

    const deleted = await Model.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ msg: "Record not found" });

    res.json({ msg: "Record deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting data", error: err.message });
  }
};





// const Admission = require("../Models/admissionModule");
// const Enquiry = require("../Models/enquiryModule");
// const Registration = require("../Models/registationModule");

// // User own data 
// exports.getUserData = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const admission = await Admission.find({ userId })
//       .populate("createdBy updatedBy", "name email");
//     const enquiry = await Enquiry.find({ userId })
//       .populate("createdBy updatedBy", "name email");
//     const registration = await Registration.find({ userId })
//       .populate("createdBy updatedBy", "name email");

//     res.json({ admission, enquiry, registration });
//   } catch (err) {
//     res.status(500).json({ msg: "Error fetching user data", error: err.message });
//   }
// };

// // HR data
// exports.getHRData = async (req, res) => {
//   try {
//     const admission = await Admission.find({}, "-installment")
//       .populate("createdBy updatedBy", "name email");
//     const enquiry = await Enquiry.find()
//       .populate("createdBy updatedBy", "name email");
//     const registration = await Registration.find()
//       .populate("createdBy updatedBy", "name email");

//     res.json({ admission, enquiry, registration });
//   } catch (err) {
//     res.status(500).json({ msg: "Error fetching HR data", error: err.message });
//   }
// };

// // Admin / Super Admin data
// exports.getAllData = async (req, res) => {
//   try {
//     const admission = await Admission.find()
//       // .populate("createdBy updatedBy", "name email");
//     const enquiry = await Enquiry.find()
//       // .populate("createdBy updatedBy", "name email");
//     const registration = await Registration.find()
//       // .populate("createdBy updatedBy", "name email");

//     res.json({ admission, enquiry, registration });
//   } catch (err) {
//     res.status(500).json({ msg: "Error fetching all data", error: err.message });
//   }
// };

// // Notification after every 50 admissions
// exports.checkNotification = async (req, res) => {
//   try {
//     const count = await Admission.countDocuments();
//     if (count % 50 === 0 && count > 0) {
//       return res.json({ notify: true, msg: `🎉 ${count} admissions completed!` });
//     }
//     res.json({ notify: false, count });
//   } catch (err) {
//     res.status(500).json({ msg: "Error checking notifications", error: err.message });
//   }
// };

// // Helper to get correct model
// const getModel = (module) => {
//   switch (module) {
//     case "admission":
//       return Admission;
//     case "registration":
//       return Registration;
//     case "enquiry":
//       return Enquiry;
//     default:
//       return null;
//   }
// };
// // Update record
// exports.updateData = async (req, res) => {
//   try {
//     const { module, id } = req.params;
//     const updateData = req.body;
//     updateData.updatedBy = req.user._id;
//     updateData.updatedAt = new Date();

//     const Model = getModel(module);
//     if (!Model) return res.status(400).json({ msg: "Invalid module" });

//     const updated = await Model.findByIdAndUpdate(id, updateData, {
//       new: true,
//       runValidators: true,
//     }).populate("createdBy updatedBy", "name email"); // populate after update

//     if (!updated) return res.status(404).json({ msg: "Record not found" });

//     res.json({ msg: "Record updated successfully", data: updated });
//   } catch (err) {
//     res.status(500).json({ msg: "Error updating data", error: err.message });
//   }
// };

// // // Delete record
// exports.deleteData = async (req, res) => {
//   try {
//     const { module, id } = req.params;

//     const Model = getModel(module);
//     if (!Model) return res.status(400).json({ msg: "Invalid module" });

//     const deleted = await Model.findByIdAndDelete(id);

//     if (!deleted) return res.status(404).json({ msg: "Record not found" });

//     res.json({ msg: "Record deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ msg: "Error deleting data", error: err.message });
//   }
// };


// exports.updateData = async (req, res) => {
//   try {
//     const { module, id } = req.params;
//     const updateData = req.body;
//     updateData.updatedBy = req.user._id;
//     updateData.updatedAt = new Date();

//     const Model = getModel(module);
//     if (!Model) return res.status(400).json({ msg: "Invalid module" });

//     // 1️⃣ Update first
//     const updated = await Model.findByIdAndUpdate(id, updateData, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updated) return res.status(404).json({ msg: "Record not found" });

//     // 2️⃣ Fetch updated record with populated fields
//     const populated = await Model.findById(id).populate(
//       "createdBy updatedBy",
//       "name email"
//     );

//     res.json({ msg: "Record updated successfully", data: populated });
//   } catch (err) {
//     res.status(500).json({ msg: "Error updating data", error: err.message });
//   }
// };