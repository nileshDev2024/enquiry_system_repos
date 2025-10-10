// import React, { useEffect, useState } from "react";
// import { getUserData, getHRData, getAllData, } from "../component/API";
// import CreateUser from "./CreateUser";

// const Content = ({ activeTab, role }) => {
//     const [data, setData] = useState([]);
//     const [search, setSearch] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const [editModalOpen, setEditModalOpen] = useState(false);
//     const [currentEditItem, setCurrentEditItem] = useState(null);
//     const [editFormData, setEditFormData] = useState({});

//     // Selected fields per module
//     const moduleFields = {
//         admission: [
//             "fullName", "email", "mobile",
//             "payment.firstInstallment.mode", "payment.firstInstallment.transactionId", "payment.firstInstallment._id",
//             "payment.secondInstallment.mode", "payment.secondInstallment.transactionId", "payment.secondInstallment._id",
//             "isAdmitted",
//         ],
//         registration: [
//             "name", "email", "mobile", "registrationFees", "paymentMethod", "transactionId"
//         ],
//         enquiry: ["name", "email", "mobile", "Enquiry_Message"]
//     };

//     // Flatten nested objects
//     const flattenObject = (obj, parentKey = "", res = {}) => {
//         for (let key in obj) {
//             if (!obj.hasOwnProperty(key)) continue;
//             const propName = parentKey ? `${parentKey}.${key}` : key;
//             if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
//                 flattenObject(obj[key], propName, res);
//             } else {
//                 res[propName] = obj[key];
//             }
//         }
//         return res;
//     };

//     // Fetch data
//     useEffect(() => {
//         if (activeTab === "create") return;

//         const fetchData = async () => {
//             setLoading(true);
//             setError(null);
//             setData([]);
//             try {
//                 let res;
//                 if (role === "HR") res = await getHRData();
//                 else if (role === "admin" || role === "super-admin") res = await getAllData();
//                 else res = await getUserData();

//                 const moduleData = res.data[activeTab] || [];
//                 setData(moduleData);
//             } catch (err) {
//                 console.error(err);
//                 setError("Failed to fetch data");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [activeTab, role]);

//     // Filter data for search
//     const filteredData = data.filter(item => {
//         const flatItem = flattenObject(item);
//         const fields = moduleFields[activeTab] || [];
//         return fields.some(key =>
//             flatItem[key] && String(flatItem[key]).toLowerCase().includes(search.toLowerCase())
//         );
//     });

//     // Edit modal
//     const handleEdit = (item) => {
//         setCurrentEditItem(item);
//         setEditFormData(flattenObject(item));
//         setEditModalOpen(true);
//     };

//     const handleEditChange = (key, value) => {
//         setEditFormData(prev => ({ ...prev, [key]: value }));
//     };

//     const handleEditSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const moduleName = activeTab;
//             await updateDataAPI(moduleName, currentEditItem._id, editFormData);
//             setData(prev =>
//                 prev.map(item => (item._id === currentEditItem._id ? { ...item, ...editFormData } : item))
//             );
//             setEditModalOpen(false);
//             alert("Updated successfully!");
//         } catch (err) {
//             console.error(err);
//             alert("Failed to update item");
//         }
//     };

//     // Delete
//     const handleDelete = async (id) => {
//         if (!window.confirm("Are you sure you want to delete this item?")) return;
//         try {
//             const moduleName = activeTab;
//             await deleteDataAPI(moduleName, id);
//             setData(prev => prev.filter(item => item._id !== id));
//             alert("Deleted successfully");
//         } catch (err) {
//             console.error(err);
//             alert("Failed to delete item");
//         }
//     };

//     const fieldsToDisplay = moduleFields[activeTab] || [];

//     return (
//         <div className="content">
//             {activeTab !== "create" && (
//                 <div className="search-bar" style={{ marginBottom: "10px" }}>
//                     <input
//                         type="text"
//                         placeholder="Search..."
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                         style={{ padding: "5px", width: "100%" }}
//                     />
//                 </div>
//             )}

//             {activeTab === "create" ? (
//                 <div className="create-form">
//                     <CreateUser />
//                 </div>
//             ) : loading ? (
//                 <p>Loading data...</p>
//             ) : error ? (
//                 <p style={{ color: "red" }}>{error}</p>
//             ) : filteredData.length === 0 ? (
//                 <p>No data found.</p>
//             ) : (
//                 <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                     <thead>
//                         <tr>
//                             <th>S.No</th>
//                             {fieldsToDisplay.map(key => (
//                                 <th key={key} style={{ border: "1px solid #ddd", padding: "8px" }}>{key}</th>
//                             ))}
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredData.map((item, idx) => {
//                             const flatItem = flattenObject(item);
//                             return (
//                                 <tr key={idx}>
//                                     <td style={{ border: "1px solid #ddd", padding: "8px" }}>{idx + 1}</td>
//                                     {fieldsToDisplay.map(key => (
//                                         <td key={key} style={{ border: "1px solid #ddd", padding: "8px" }}>
//                                             {flatItem[key] !== undefined ? String(flatItem[key]) : "-"}
//                                         </td>
//                                     ))}
//                                     <td style={{ border: "1px solid #ddd", padding: "8px" }}>
//                                         <button onClick={() => handleEdit(item)} style={{ marginRight: "5px" }}>Edit</button>
//                                         <button onClick={() => handleDelete(item._id)} style={{ color: "red" }}>Delete</button>
//                                     </td>
//                                 </tr>
//                             );
//                         })}
//                     </tbody>
//                 </table>
//             )}

//             {/* Edit Modal */}
//             {editModalOpen && (
//                 <div
//                     style={{
//                         position: "fixed",
//                         top: 0, left: 0,
//                         width: "100%", height: "100%",
//                         backgroundColor: "rgba(0,0,0,0.5)",
//                         display: "flex", justifyContent: "center", alignItems: "center",
//                         zIndex: 1000,
//                     }}
//                 >
//                     <div style={{ background: "#fff", padding: "20px", maxHeight: "80vh", overflowY: "auto" }}>
//                         <h2>Edit Record</h2>
//                         <form onSubmit={handleEditSubmit}>
//                             {fieldsToDisplay.map(key => (
//                                 <div key={key} style={{ marginBottom: "10px" }}>
//                                     <label style={{ display: "block", fontWeight: "bold" }}>{key}</label>
//                                     <input
//                                         type="text"
//                                         value={editFormData[key] || ""}
//                                         onChange={(e) => handleEditChange(key, e.target.value)}
//                                         style={{ width: "100%", padding: "5px" }}
//                                     />
//                                 </div>
//                             ))}
//                             <div style={{ marginTop: "10px" }}>
//                                 <button type="submit" style={{ marginRight: "10px" }}>Save</button>
//                                 <button type="button" onClick={() => setEditModalOpen(false)}>Cancel</button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Content;

// import React, { useEffect, useState } from "react";
// import {
//   getUserData,
//   getHRData,
//   getAllData,

// } from "../component/API";
// import CreateUser from "./CreateUser";

// const Content = ({ activeTab, role }) => {
//   const [data, setData] = useState([]);
//   const [search, setSearch] = useState("");
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [editFormData, setEditFormData] = useState({});
//   const [editModule, setEditModule] = useState("");
//   const [editId, setEditId] = useState(null);

//   const fieldsToDisplay = [
//     "name","email","paymentMethod","mobile","examDate","registrationFees",
//     "transactionId","payment.firstInstallment.mode","payment.firstInstallment.transactionId",
//     "payment.firstInstallment._id","payment.secondInstallment.mode","payment.secondInstallment.transactionId",
//     "payment.secondInstallment._id","isAdmitted","Enquiry_Message",
//   ];

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
//         console.error(err);
//         setData([]);
//       }
//     };
//     fetchData();
//   }, [activeTab, role]);

//   const filteredData = data.filter(item =>
//     Object.values(item).some(v =>
//       String(v).toLowerCase().includes(search.toLowerCase())
//     )
//   );

//   const handleEditClick = (item, module) => {
//     setEditFormData(item);
//     setEditModule(module);
//     setEditId(item._id);
//     setEditModalOpen(true);
//   };

//   const handleEditChange = (key, value) => {
//     if (key.includes(".")) {
//       const keys = key.split(".");
//       setEditFormData(prev => {
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
//       setEditFormData(prev => ({ ...prev, [key]: value }));
//     }
//   };

//   const handleEditSubmit = async e => {
//     e.preventDefault();
//     try {
//       await updateDataAPI(editModule, editId, editFormData);
//       alert("✅ Record updated successfully");
//       setEditModalOpen(false);
//       window.location.reload();
//     } catch (err) {
//       console.error(err);
//       alert("❌ Error updating record");
//     }
//   };

//   const handleDelete = async (module, id) => {
//     if (!window.confirm("Are you sure you want to delete this record?")) return;
//     try {
//       await deleteDataAPI(module, id);
//       alert("🗑️ Record deleted successfully");
//       setData(prev => prev.filter(item => item._id !== id));
//     } catch (err) {
//       console.error(err);
//       alert("❌ Error deleting record");
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
//             onChange={e => setSearch(e.target.value)}
//           />
//         </div>
//       )}

//       {activeTab === "create" ? <CreateUser /> : (
//         <table>
//           <thead>
//             <tr>
//               <th>S.No</th>
//               {fieldsToDisplay.map(key => <th key={key}>{key}</th>)}
//               <th>Created By</th>
//               <th>Updated By</th>
//               <th>Updated At</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.map((item, idx) => (
//               <tr key={item._id}>
//                 <td>{idx + 1}</td>
//                 {fieldsToDisplay.map(key => {
//                   const keys = key.split(".");
//                   let val = item;
//                   for (let k of keys) val = val?.[k];
//                   return <td key={key}>{val ? String(val) : "-"}</td>;
//                 })}
//                 <td>{item.createdBy?.name || "-"}</td>
//                 <td>{item.updatedBy?.name || "-"}</td>
//                 <td>{item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "-"}</td>
//                 <td>
//                   <button onClick={() => handleEditClick(item, activeTab)}>✏️ Edit</button>
//                   <button onClick={() => handleDelete(activeTab, item._id)} style={{color:"red"}}>🗑️ Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {/* Edit Modal */}
//       {editModalOpen && (
//         <div style={{position:"fixed", top:0, left:0, width:"100%", height:"100%", backgroundColor:"rgba(0,0,0,0.5)", display:"flex", justifyContent:"center", alignItems:"center", zIndex:1000}}>
//           <div style={{background:"#fff", padding:"20px", maxHeight:"80vh", overflowY:"auto", width:"500px", borderRadius:"10px"}}>
//             <h2>Edit Record</h2>
//             <form onSubmit={handleEditSubmit}>
//               {fieldsToDisplay.map(key => {
//                 if(key==="isAdmitted") {
//                   return <div key={key}><label><input type="checkbox" checked={!!editFormData[key]} onChange={e=>handleEditChange(key,e.target.checked)} /> {key}</label></div>
//                 }
//                 if(key==="examDate") {
//                   return <div key={key}><label>{key}</label><input type="date" value={editFormData[key]? new Date(editFormData[key]).toISOString().split("T")[0]:""} onChange={e=>handleEditChange(key,e.target.value)} /></div>
//                 }
//                 if(key==="paymentMethod" || key==="payment.firstInstallment.mode" || key==="payment.secondInstallment.mode") {
//                   return <div key={key}><label>{key}</label><select value={editFormData[key]||""} onChange={e=>handleEditChange(key,e.target.value)}>
//                     <option value="">Select</option>
//                     <option value="cash">Cash</option>
//                     {/* <option value="upi">UPI</option> */}
//                     {/* <option value="card">Card</option> */}
//                     {/* <option value="netbanking">Net Banking</option> */}
//                   </select></div>
//                 }
//                 return <div key={key}><label>{key}</label><input type="text" value={editFormData[key]||""} onChange={e=>handleEditChange(key,e.target.value)} /></div>
//               })}
//               <button type="submit">Save</button>
//               <button type="button" onClick={()=>setEditModalOpen(false)}>Cancel</button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default Content;



// import React, { useEffect, useState } from "react";
// import {
//   getUserData,
//   getHRData,
//   getAllData,
//   updateDataAPI,
//   deleteDataAPI,
// } from "../component/API";
// import CreateUser from "./CreateUser";

// const Content = ({ activeTab, role }) => {
//   const [data, setData] = useState([]);
//   const [search, setSearch] = useState("");
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [editFormData, setEditFormData] = useState({});
//   const [editModule, setEditModule] = useState("");
//   const [editId, setEditId] = useState(null);

//   // ✅ Fields per module
//   const moduleFields = {
//     admission: [
//       "fullName", "email", "mobile",
//       "payment.firstInstallment.mode", "payment.firstInstallment.transactionId", "payment.firstInstallment._id",
//       "payment.secondInstallment.mode", "payment.secondInstallment.transactionId", "payment.secondInstallment._id",
//       "isAdmitted",
//     ],
//     registration: [
//       "name", "email", "mobile", "registrationFees", "paymentMethod", "transactionId"
//     ],
//     enquiry: ["name", "email", "mobile", "Enquiry_Message"]


//   };

//   const fieldsToDisplay = moduleFields[activeTab] || [];

//   // ✅ Fetch Data
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
//         console.error("❌ Error fetching data:", err);
//         setData([]);
//       }
//     };
//     fetchData();
//   }, [activeTab, role]);

//   // ✅ Filtered search
//   const filteredData = data.filter((item) =>
//     Object.values(item).some((v) =>
//       String(v).toLowerCase().includes(search.toLowerCase())
//     )
//   );

//   // ✅ Edit handler
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
//       alert("✅ Record updated successfully");
//       setEditModalOpen(false);
//       setData((prev) =>
//         prev.map((item) =>
//           item._id === editId ? { ...item, ...editFormData } : item
//         )
//       );
//     } catch (err) {
//       console.error("❌ Error updating record:", err);
//       alert("Error updating record");
//     }
//   };

//   const handleDelete = async (module, id) => {
//     if (!window.confirm("Are you sure you want to delete this record?")) return;
//     try {
//       await deleteDataAPI(module, id);
//       alert("🗑️ Record deleted successfully");
//       setData((prev) => prev.filter((item) => item._id !== id));
//     } catch (err) {
//       console.error("❌ Error deleting record:", err);
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
//               <th>Updated At</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.length === 0 ? (
//               <tr>
//                 <td colSpan={fieldsToDisplay.length + 4}>No records found</td>
//               </tr>
//             ) : (
//               filteredData.map((item, idx) => (
//                 <tr key={item._id}>
//                   <td>{idx + 1}</td>
//                   {fieldsToDisplay.map((key) => {
//                     const keys = key.split(".");
//                     let val = item;
//                     for (let k of keys) val = val?.[k];
//                     return <td key={key}>{val ? String(val) : "-"}</td>;
//                   })}
//                   <td>{item.createdBy?.name || "-"}</td>
//                   <td>{item.updatedBy?.name || "-"}</td>
//                   <td>
//                     {item.updatedAt
//                       ? new Date(item.updatedAt).toLocaleString()
//                       : "-"}
//                   </td>
//                   <td>
//                     <button onClick={() => handleEditClick(item, activeTab)}>
//                       ✏️ Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(activeTab, item._id)}
//                       style={{ color: "red" }}
//                     >
//                       🗑️ Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       )}

//       {/* ✅ Edit Modal */}
//       {editModalOpen && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
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
//                     value={
//                       key.includes(".")
//                         ? key.split(".").reduce((o, k) => o?.[k], editFormData) || ""
//                         : editFormData[key] || ""
//                     }
//                     onChange={(e) => handleEditChange(key, e.target.value)}
//                   />
//                 </div>
//               ))}
//               <button type="submit">Save</button>
//               <button type="button" onClick={() => setEditModalOpen(false)}>
//                 Cancel
//               </button>
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
    registration: [
      "name",
      "email",
      "mobile",
      "registrationFees",
      "paymentMethod",
      "transactionId",
      "examDate",
    ],
    enquiry: ["name", "email", "mobile", "Enquiry_Message"],
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
              {(role === "admin" || role === "super-admin") && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={fieldsToDisplay.length + 6 + ((role === "admin" || role === "super-admin") ? 1 : 0)}>
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
                  {(role === "admin" || role === "super-admin") && (
                    <td>
                      <button onClick={() => handleEditClick(item, activeTab)}>✏️ Edit</button>
                      <button onClick={() => handleDelete(activeTab, item._id)} style={{ color: "red" }}>🗑️ Delete</button>
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
            top: 0, left: 0,
            width: "100%", height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              maxHeight: "80vh",
              overflowY: "auto",
              width: "500px",
              borderRadius: "10px",
            }}
          >
            <h2>Edit {activeTab} Record</h2>
            <form onSubmit={handleEditSubmit}>
              {fieldsToDisplay.map((key) => (
                <div key={key}>
                  <label>{key}</label>
                  <input
                    type="text"
                    value={key.includes(".")
                      ? key.split(".").reduce((o, k) => o?.[k], editFormData) ?? ""
                      : editFormData[key] ?? ""}
                    onChange={(e) => handleEditChange(key, e.target.value)}
                  />
                </div>
              ))}
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditModalOpen(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Content;
