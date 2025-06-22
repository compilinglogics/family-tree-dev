import { useEffect, useState } from "react";

const userId = "6813c5350a232d4006827363";

const AdminStatusBadge = ({ socket }) => {
  const [isOnline, setIsOnline] = useState(null);

useEffect(() => {
  if (!socket) {
    console.log("⚠️ No socket instance found");
    return;
  }

  console.log("✅ Emitting check-user-online...");
  socket.emit("check-user-online", userId);

  socket.on("user-online-status", ({ isOnline }) => {
    console.log("✅ Received user-online-status:", isOnline);
    setIsOnline(isOnline);
  });

  return () => {
    socket.off("user-online-status");
  };
}, [socket]);


  if (isOnline === null) {
    return (
      <div className="mb-2 text-muted fw-semibold">Checking Admin Status...</div>
    );
  }

  return (
    <div className="mb-2 text-muted fw-semibold">
      {" "}
      <span style={{ color: isOnline ? "green" : "red" }}>
        {isOnline ? "Online" : "Offline"}
      </span>
    </div>
  );
};

export default AdminStatusBadge;
