// const mongoose = require("mongoose");

// const installmentSchema = new mongoose.Schema({
//   mode: {
//     type: String,
//     enum: ["online", "cash"],
//     required: true,
//     set: (v) => (v === "" ? undefined : v), // convert "" → undefined
//   },
//   transactionId: {
//     type: String,
//     unique: true,
//     sparse: true,
//     required: function () {
//       return this.mode === "online"; // required if online
//     },
//     validate: {
//       validator: function (value) {
//         if (this.mode === "cash" && value) {
//           throw new Error("Transaction ID not required in cash payment");
//         }
//         return true;
//       },
//       message: "Transaction ID not required in cash payment", 
//     },
//   },
// });

// const admissionSchema = new mongoose.Schema(
//   {
//     fullName: { type: String, required: true },
//     mobile: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     course: { type: String, required: true },
//     isAdmitted: { type: Boolean, default: true },
//     payment: {
//       firstInstallment: {
//         type: installmentSchema,
//         required: true, 
//       },
//       secondInstallment: {
//         type: installmentSchema,
//         required: false, 
//       },
//     },
//   },
//   { timestamps: true }
// );

// const admissionModule = mongoose.model("Admission", admissionSchema);
// module.exports = admissionModule;



const mongoose = require("mongoose");

const installmentSchema = new mongoose.Schema({
  mode: {
    type: String,
    enum: ["online", "cash"],
    required: true,
    set: (v) => (v === "" ? undefined : v),
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true,
    required: function () { return this.mode === "online"; },
  },
});

const admissionSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  course: { type: String, required: true },
  isAdmitted: { type: Boolean, default: true },
  payment: {
    firstInstallment: { type: installmentSchema, required: true },
    secondInstallment: { type: installmentSchema },
  },
  createdBy: { type: String },  
  updatedBy: { type: String },                  
}, { timestamps: true }); 

module.exports = mongoose.model("Admission", admissionSchema);

