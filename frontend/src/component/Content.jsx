// import React, { useEffect, useState } from "react";
// import {
//   getUserData,
//   getHRData,
//   getAllData,
//   updateDataAPI,
//   deleteDataAPI,
// } from "../component/API";
// import CreateUser from "./CreateUser";
// import { MdDelete } from "react-icons/md";
// import { MdModeEdit } from "react-icons/md";
// const Content = ({ activeTab, role }) => {
//   const [data, setData] = useState([]);
//   const [search, setSearch] = useState("");
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [editFormData, setEditFormData] = useState({});
//   const [editModule, setEditModule] = useState("");
//   const [editId, setEditId] = useState(null);

//   // Fields per module
//   const moduleFields = {
//     admission: [
//       "fullName",
//       "email",
//       "mobile",
//       "payment.firstInstallment.mode",
//       "payment.firstInstallment.transactionId",
//       "payment.secondInstallment.mode",
//       "payment.secondInstallment.transactionId",
//       "isAdmitted",
//     ],
//     registration: [
//       "name",
//       "email",
//       "mobile",
//       "registrationFees",
//       "paymentMethod",
//       "transactionId",
//       "examDate",
//     ],
//     enquiry: ["name", "email", "mobile", "Enquiry_Message"],
//   };

//   const fieldsToDisplay = moduleFields[activeTab] || [];

//   // Fetch Data
//   useEffect(() => {
//     if (activeTab === "create") return;

//     const fetchData = async () => {
//       try {
//         let res;
//         if (role === "HR") res = await getHRData();
//         else if (role === "admin" || role === "super-admin") res = await getAllData();
//         else res = await getUserData();
//         setData(res.data[activeTab] || []);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setData([]);
//       }
//     };

//     fetchData();
//   }, [activeTab, role]);

//   // Filter search
//   const filteredData = data.filter((item) =>
//     Object.values(item).some((v) =>
//       String(v).toLowerCase().includes(search.toLowerCase())
//     )
//   );

//   // Edit handlers
//   const handleEditClick = (item, module) => {
//     setEditFormData(item);
//     setEditModule(module);
//     setEditId(item._id);
//     setEditModalOpen(true);
//   };

//   const handleEditChange = (key, value) => {
//     if (key.includes(".")) {
//       const keys = key.split(".");
//       setEditFormData((prev) => {
//         let temp = { ...prev };
//         let ref = temp;
//         for (let i = 0; i < keys.length - 1; i++) {
//           if (!ref[keys[i]]) ref[keys[i]] = {};
//           ref = ref[keys[i]];
//         }
//         ref[keys[keys.length - 1]] = value;
//         return { ...temp };
//       });
//     } else {
//       setEditFormData((prev) => ({ ...prev, [key]: value }));
//     }
//   };

//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await updateDataAPI(editModule, editId, editFormData);
//       alert("Record updated successfully");
//       setEditModalOpen(false);
//       setData((prev) =>
//         prev.map((item) =>
//           item._id === editId ? { ...item, ...editFormData } : item
//         )
//       );
//     } catch (err) {
//       console.error("Error updating record:", err);
//       alert("Error updating record");
//     }
//   };

//   const handleDelete = async (module, id) => {
//     if (!window.confirm("Are you sure you want to delete this record?")) return;
//     try {
//       await deleteDataAPI(module, id);
//       alert("Record deleted successfully");
//       setData((prev) => prev.filter((item) => item._id !== id));
//     } catch (err) {
//       console.error("Error deleting record:", err);
//       alert("Error deleting record");
//     }
//   };

//   return (
//     <div className="content">
//       {activeTab !== "create" && (
//         <div className="search-bar">
//           <input
//             type="text"
//             placeholder="Search..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//       )}

//       {activeTab === "create" ? (
//         <CreateUser />
//       ) : (
//         <table>
//           <thead>
//             <tr>
//               <th>S.No</th>
//               {fieldsToDisplay.map((key) => (
//                 <th key={key}>{key}</th>
//               ))}
//               <th>Created By</th>
//               <th>Updated By</th>
//               <th>Created At</th>
//               <th>Updated At</th>
//               {(role === "admin" || role === "super-admin") && <th>Action</th>}
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.length === 0 ? (
//               <tr>
//                 <td colSpan={fieldsToDisplay.length + 6 + ((role === "admin" || role === "super-admin") ? 1 : 0)}>
//                   No records found
//                 </td>
//               </tr>
//             ) : (
//               filteredData.map((item, idx) => (
//                 <tr key={item._id}>
//                   <td>{idx + 1}</td>
//                   {fieldsToDisplay.map((key) => {
//                     const keys = key.split(".");
//                     let val = item;
//                     for (let k of keys) val = val?.[k];
//                     return <td key={key}>{val ?? "-"}</td>;
//                   })}
//                   <td>{item.createdBy ?? "-"}</td>
//                   <td>{item.updatedBy ?? "-"}</td>
//                   <td>{item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}</td>
//                   <td>{item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "-"}</td>
//                   {(role === "admin" || role === "super-admin") && (
//                     <td>
//                       <button onClick={() => handleEditClick(item, activeTab)} style={{ color: "black", padding:"5px", marginBottom:"5px" }}   ><MdModeEdit/>            Edit</button>
//                       <button onClick={() => handleDelete(activeTab, item._id)} style={{ color: "red" }}>< MdDelete/> Delete</button>
//                     </td>
//                   )}
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       )}

//       {/* Edit Modal */}
//       {editModalOpen && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0, left: 0,
//             width: "100%", height: "100%",
//             backgroundColor: "rgba(0,0,0,0.5)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 1000,
//           }}
//         >
//           <div
//             style={{
//               background: "#fff",
//               padding: "20px",
//               maxHeight: "80vh",
//               overflowY: "auto",
//               width: "500px",
//               borderRadius: "10px",
//             }}
//           >
//             <h2>Edit {activeTab} Record</h2>
//             <form onSubmit={handleEditSubmit}>
//               {fieldsToDisplay.map((key) => (
//                 <div key={key}>
//                   <label>{key}</label>
//                   <input
//                     type="text"
//                     value={key.includes(".")
//                       ? key.split(".").reduce((o, k) => o?.[k], editFormData) ?? ""
//                       : editFormData[key] ?? ""}
//                     onChange={(e) => handleEditChange(key, e.target.value)}
//                   />
//                 </div>
//               ))}
//               <button type="submit">Save</button>
//               <button type="button" onClick={() => setEditModalOpen(false)}>Cancel</button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Content;




import React, { useEffect, useState } from "react";
import {
  getUserData,
  getHRData,
  getAllData,
  updateDataAPI,
  deleteDataAPI,
} from "../component/API";
import CreateUser from "./CreateUser";
import { MdDelete, MdModeEdit } from "react-icons/md";

const Content = ({ activeTab, role }) => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [editModule, setEditModule] = useState("");
  const [editId, setEditId] = useState(null);

  // Fields per module
  const moduleFields = {
    admission: [
      "fullName",
      "email",
      "mobile",
      "payment.firstInstallment.mode",
      "payment.firstInstallment.transactionId",
      "payment.secondInstallment.mode",
      "payment.secondInstallment.transactionId",
      "isAdmitted",
    ],
    registration: ["name", "email", "mobile", "registrationFees", "paymentMethod", "transactionId", "examDate"],
    enquiry: ["name", "email", "mobile", "registrationFees", "Enquiry_Message"],
  };

  const fieldsToDisplay = moduleFields[activeTab] || [];

  // Fetch Data
  useEffect(() => {
    if (activeTab === "create") return;

    const fetchData = async () => {
      try {
        let res;
        if (role === "HR") res = await getHRData();
        else if (role === "admin" || role === "super-admin") res = await getAllData();
        else res = await getUserData();
        setData(res.data[activeTab] || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setData([]);
      }
    };

    fetchData();
  }, [activeTab, role]);

  // Filter search
  const filteredData = data.filter((item) =>
    Object.values(item).some((v) =>
      String(v).toLowerCase().includes(search.toLowerCase())
    )
  );

  // Edit handlers
  const handleEditClick = (item, module) => {
    setEditFormData(item);
    setEditModule(module);
    setEditId(item._id);
    setEditModalOpen(true);
  };

  const handleEditChange = (key, value) => {
    if (key.includes(".")) {
      const keys = key.split(".");
      setEditFormData((prev) => {
        let temp = { ...prev };
        let ref = temp;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!ref[keys[i]]) ref[keys[i]] = {};
          ref = ref[keys[i]];
        }
        ref[keys[keys.length - 1]] = value;
        return { ...temp };
      });
    } else {
      setEditFormData((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDataAPI(editModule, editId, editFormData);
      alert("Record updated successfully");
      setEditModalOpen(false);
      setData((prev) =>
        prev.map((item) =>
          item._id === editId ? { ...item, ...editFormData } : item
        )
      );
    } catch (err) {
      console.error("Error updating record:", err);
      alert("Error updating record");
    }
  };

  const handleDelete = async (module, id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await deleteDataAPI(module, id);
      alert("Record deleted successfully");
      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Error deleting record:", err);
      alert("Error deleting record");
    }
  };

  // Determine editable fields per role
  const isFieldEditable = (key) => {
    if (role === "HR" && activeTab === "admission") {
      return key.startsWith("payment.secondInstallment");
    }
    if (role === "admin" || role === "super-admin") return true;
    return false;
  };

  return (
    <div className="content">
      {activeTab !== "create" && (
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {activeTab === "create" ? (
        <CreateUser />
      ) : (
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              {fieldsToDisplay.map((key) => (
                <th key={key}>{key}</th>
              ))}
              <th>Created By</th>
              <th>Updated By</th>
              <th>Created At</th>
              <th>Updated At</th>
              {((role === "admin" || role === "super-admin") || (role === "HR" && activeTab === "admission")) && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={fieldsToDisplay.length + 6 + (((role === "admin" || role === "super-admin") || (role === "HR" && activeTab === "admission")) ? 1 : 0)}>
                  No records found
                </td>
              </tr>
            ) : (
              filteredData.map((item, idx) => (
                <tr key={item._id}>
                  <td>{idx + 1}</td>
                  {fieldsToDisplay.map((key) => {
                    const keys = key.split(".");
                    let val = item;
                    for (let k of keys) val = val?.[k];
                    return <td key={key}>{val ?? "-"}</td>;
                  })}
                  <td>{item.createdBy ?? "-"}</td>
                  <td>{item.updatedBy ?? "-"}</td>
                  <td>{item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}</td>
                  <td>{item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "-"}</td>
                  {((role === "admin" || role === "super-admin") || (role === "HR" && activeTab === "admission")) && (
                    <td>
                      <button
                        onClick={() => handleEditClick(item, activeTab)}
                        style={{ color: "black", padding: "4px", marginBottom: "5px" }}
                      >
                        <MdModeEdit /> Edit
                      </button>
                      {(role === "admin" || role === "super-admin") && (
                        <button onClick={() => handleDelete(activeTab, item._id)} style={{ color: "red" }}>
                          <MdDelete /> Delete
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      backdropFilter: "blur(3px)",
    }}
  >
    <div
      style={{
        background: "#fff",
        padding: "30px",
        width: "500px",
        borderRadius: "16px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
        animation: "fadeIn 0.3s ease",
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#ea121dff",
          marginBottom: "20px",
          fontSize: "22px",
        }}
      >
        Edit {activeTab} Record
      </h2>

      <form onSubmit={handleEditSubmit}>
        {fieldsToDisplay.map((key) => (
          <div key={key} style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                fontWeight: "600",
                color: "#34495e",
                marginBottom: "6px",
                textTransform: "capitalize",
              }}
            >
              {key.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type="text"
              value={
                key.includes(".")
                  ? key.split(".").reduce((o, k) => o?.[k], editFormData) ?? ""
                  : editFormData[key] ?? ""
              }
              onChange={(e) => handleEditChange(key, e.target.value)}
              disabled={!isFieldEditable(key)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "15px",
                outline: "none",
                transition: "0.3s",
                backgroundColor: !isFieldEditable(key)
                  ? "#f5f5f5"
                  : "white",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "#4a90e2")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "#ccc")
              }
            />
          </div>
        ))}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "25px",
          }}
        >
          <button
            type="button"
            onClick={() => setEditModalOpen(false)}
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              border: "none",
              background: "#e74c3c",
              color: "#fff",
              cursor: "pointer",
              fontSize: "15px",
              transition: "0.3s",
            }}
            onMouseOver={(e) =>
              (e.target.style.background = "#c0392b")
            }
            onMouseOut={(e) =>
              (e.target.style.background = "#e74c3c")
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              border: "none",
              background: "#4a90e2",
              color: "#fff",
              cursor: "pointer",
              fontSize: "15px",
              transition: "0.3s",
            }}
            onMouseOver={(e) =>
              (e.target.style.background = "#357ab7")
            }
            onMouseOut={(e) =>
              (e.target.style.background = "#4a90e2")
            }
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default Content;
