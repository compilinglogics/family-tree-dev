// import { useEffect, useState } from "react";

// const userId = "681e3db3e4adeb7a1bfa84c2";

// const AdminStatusBadge = ({ socket }) => {
//   const [isOnline, setIsOnline] = useState(null);

// useEffect(() => {
//   if (!socket) {
//     console.log("⚠️ No socket instance found");
//     return;
//   }

//   console.log("✅ Emitting check-user-online...");
//   socket.emit("check-user-online", userId);

//   socket.on("user-online-status", ({ isOnline }) => {
//     console.log("✅ Received user-online-status:", isOnline);
//     setIsOnline(isOnline);
//   });

//   return () => {
//     socket.off("user-online-status");
//   };
// }, [socket]);


//   if (isOnline === null) {
//     return (
//       <div className="mb-2 text-muted fw-semibold">Checking Admin Status...</div>
//     );
//   }

//   return (
//     <div className="mb-2 text-muted fw-semibold">
//       {" "}
//       <span style={{ color: isOnline ? "green" : "red" }}>
//         {isOnline ? "Online" : "Offline"}
//       </span>
//     </div>
//   );
// };

// export default AdminStatusBadge;


"use client"

import { useEffect, useState } from "react"

// Keep the same hardcoded admin ID
const ADMIN_ID = "681e3db3e4adeb7a1bfa84c2"

const AdminStatusBadge = ({ socket }) => {
  const [isOnline, setIsOnline] = useState(null)

  useEffect(() => {
    if (!socket) {
      console.log("⚠️ No socket instance found")
      return
    }

    console.log("✅ Setting up admin status listeners...")

    // Initial check when component mounts
    console.log("🔍 Checking admin status on mount...")
    socket.emit("check-user-online", ADMIN_ID)

    // Listen for admin online status response
    const handleUserOnlineStatus = ({ isOnline }) => {
      console.log("✅ Received admin status:", isOnline)
      setIsOnline(isOnline)
    }

    // Listen for admin status updates (real-time)
    const handleAdminStatusUpdate = ({ isOnline }) => {
      console.log("🔥 Admin status updated:", isOnline)
      setIsOnline(isOnline)
    }

    // Listen for online users list updates
    const handleOnlineUsers = (onlineUsers) => {
      const adminOnline = onlineUsers.includes(ADMIN_ID)
      console.log("📋 Online users updated. Admin online:", adminOnline)
      console.log("📋 All online users:", onlineUsers)
      setIsOnline(adminOnline)
    }

    // Set up event listeners
    socket.on("user-online-status", handleUserOnlineStatus)
    socket.on("admin-status-update", handleAdminStatusUpdate)
    socket.on("onlineUser", handleOnlineUsers)

    // Check admin status every 10 seconds
    const interval = setInterval(() => {
      console.log("🔄 Periodic admin status check...")
      socket.emit("check-user-online", ADMIN_ID)
    }, 10000)

    return () => {
      socket.off("user-online-status", handleUserOnlineStatus)
      socket.off("admin-status-update", handleAdminStatusUpdate)
      socket.off("onlineUser", handleOnlineUsers)
      clearInterval(interval)
    }
  }, [socket])

  if (isOnline === null) {
    return <div className="mb-2 text-muted fw-semibold">🔍 Checking Admin Status...</div>
  }

  return (
    <div className="mb-2 fw-semibold">
      <div
        className="d-inline-flex align-items-center px-3 py-1 rounded-pill"
        style={{
          backgroundColor: isOnline ? "#d4edda" : "#f8d7da",
          color: isOnline ? "#155724" : "#721c24",
          border: `1px solid ${isOnline ? "#c3e6cb" : "#f5c6cb"}`,
        }}
      >
        <span className="me-2">{isOnline ? "🟢" : "🔴"}</span>
        <span style={{ fontSize: "14px" }}>Admin {isOnline ? "Online" : "Offline"}</span>
      </div>
    </div>
  )
}

export default AdminStatusBadge
