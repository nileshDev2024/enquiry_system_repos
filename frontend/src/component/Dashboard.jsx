// import React, { useEffect, useState } from "react";
// import Sidebar from "../component/Sidebar";
// import Content from "../component/Content";
// import API from "../component/API";

// const Dashboard = () => {
//   const [user, setUser] = useState({});
//   const [activeTab, setActiveTab] = useState("registration");
//   const [data, setData] = useState({ admission: [], enquiry: [], registration: [] });
//   const [notification, setNotification] = useState(null);

//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");

//   // Fetch user profile
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await API.get("/dashboard/mydata", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUser(res.data.user || { name: "User", role });
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchUser();
//   }, [token, role]);

//   // Fetch data when active tab changes
//   useEffect(() => {
//     const fetchData = async () => {
//       let url = "/dashboard/mydata"; // default for user
//       if (role === "HR") url = "/dashboard/hrdata";
//       if (role === "admin" || role === "super-admin") url = "/dashboard/all";

//       try {
//         const res = await API.get(url, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setData(res.data); // { admission: [], enquiry: [], registration: [] }
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchData();
//   }, [activeTab, role, token]);

//   // Notification check
//   useEffect(() => {
//     const interval = setInterval(async () => {
//       try {
//         const res = await API.get("/dashboard/checkNotification", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (res.data.notify) setNotification(res.data.msg);
//       } catch (err) {
//         console.error(err);
//       }
//     }, 10000);
//     return () => clearInterval(interval);
//   }, [token]);

//   return (
//     <div className="dashboard-container">
//       {notification && <div className="notification">{notification}</div>}
//       <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
//       <Content activeTab={activeTab} data={data} />
//     </div>
//   );
// };

// export default Dashboard;


import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import Content from "../component/Content";
import { getUserData, getHRData, getAllData, checkNotification } from "../component/API";

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [activeTab, setActiveTab] = useState("mydata");
  const [role, setRole] = useState(localStorage.getItem("role") || "user");
  const [notification, setNotification] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Set activeTab from URL or role
  useEffect(() => {
    const path = location.pathname.split("/").pop();
    if (["mydata", "hrdata", "all"].includes(path)) setActiveTab(path);
    else {
      if (role === "HR") setActiveTab("hrdata");
      else if (role === "admin" || role === "super-admin") setActiveTab("all");
      else setActiveTab("mydata");
    }
  }, [location.pathname, role]);

  // Fetch user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserData();
        setUser(res.data.user || { name: "User", role });
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };
    fetchUser();
  }, [role, navigate]);

  // Notification polling
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await checkNotification();
        if (res.data.notify) setNotification(res.data.msg);
      } catch (err) {
        console.error(err);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      {notification && <div className="notification">{notification}</div>}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} role={role} />
      <Content activeTab={activeTab} role={role} />
    </div>
  );
};

export default Dashboard;


