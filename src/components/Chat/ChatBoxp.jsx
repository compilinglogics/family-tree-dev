import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { getLocalStorageData } from "../../common/commonFunction/commonFunction";
import { FiCamera, FiImage, FiMic, FiX } from "react-icons/fi"; // Icons
import { BsEmojiSmile } from "react-icons/bs";
import { fetchAllMessages } from "../../utils/chatApi";
import { uploadImage } from "../../utils/cloudImageUpload"; // Image Upload
import ChatUserDetails from "./ChatUserDetails";
import AdminStatusBadge from "./AdminStatusBadge"; // update path as needed

function ChatBox({ user }) {
  const socketRef = useRef();
  const chatBoxRef = useRef();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // Image Preview
  const [imageFile, setImageFile] = useState(null); // File to Upload
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null); // Fullscreen Image Preview

  // const BASE_URL = import.meta.env.CHAT_URL; // WebSocket endpoint
  // const BASE_URL = "http://localhost:8000";  // WebSocket endpoint
  const BASE_URL = "http://157.173.222.27:3002/"; // WebSocket endpoint
  // const BASE_URL = "http://3.133.136.217:8000";  // WebSocket endpoint
  const dispatch = useDispatch();
  const token = getLocalStorageData("token");
  const savedUserDetails = getLocalStorageData("user");
  const storedUser = JSON.parse(savedUserDetails);

  useEffect(() => {
    const loadMessages = async () => {
      const initialMessages = await fetchAllMessages();
      const selectedMessages =
        initialMessages.conversation.find(
          (item) => item.userDetails._id === user._id
        )?.messages || [];
      setMessages(selectedMessages);
    };

    loadMessages();

    const socket = io(BASE_URL, {
      transports: ["websocket"],
      secure: process.env.NODE_ENV !== "development",
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      auth: {
        token: token,
      },
      path: "/socket.io", // Ensure this matches your server
    });

    socket.on("message", (newMessages) => {
      setMessages([...newMessages]);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [BASE_URL, dispatch, user]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setSelectedImage(URL.createObjectURL(file)); // Show preview
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImageFile(null);
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if ((message.trim() || imageFile) && socketRef.current) {
      let imageUrl = null;

      if (imageFile) {
        setIsUploading(true);
        imageUrl = await uploadImage(imageFile);
        setIsUploading(false);
      }

      const newMessage = {
        text: message.trim(),
        sender: storedUser?._id,
        receiver: user._id,
        msgByUserId: storedUser?._id,
        imageUrl: imageUrl || null,
      };

      if (socketRef.current.connected) {
        socketRef.current.emit("new message", newMessage);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessage("");
        setSelectedImage(null);
        setImageFile(null);
      } else {
        console.error("Socket is not connected!");
      }
    }
  };

  return (
    <div className="container my-4 d-flex justify-content-between flex-column h-100">
      <ChatUserDetails user={user} />
{socketRef.current && <AdminStatusBadge socket={socketRef.current} />}

<div
  className="chat-box w-100"
  ref={chatBoxRef}
  style={{
    maxHeight: "70vh",
    overflowY: "auto",
  }}
>
  {messages.map((msg, index) => (
    <ChatMessage
      key={index}
      message={msg.text}
      imageUrl={msg.imageUrl}
      isSender={msg.msgByUserId === storedUser?._id}
      avatar="https://via.placeholder.com/40"
      onClickImage={() => setPreviewImage(msg.imageUrl)}
    />
  ))}
</div>


      <div className="card-footer p-3 w-100">
        {/* Image Preview - Left Side */}
        {selectedImage && (
          <div className="d-flex align-items-center mb-2">
            {/* Remove Image Button (Left Side) */}
            <button
              className="btn btn-danger btn-sm me-2"
              onClick={removeSelectedImage}
            >
              <FiX size={18} />
            </button>

            {/* Preview Image */}
            <img
              src={selectedImage}
              alt="Preview"
              className="img-thumbnail"
              style={{ maxWidth: "80px", borderRadius: "8px" }}
            />
          </div>
        )}

        {/* Bottom Section - Image Upload, Text Input, and Send Button */}
        <div className="d-flex align-items-center">
          {/* Image Upload Button */}
          <label className="btn btn-light p-2 rounded-circle me-2">
            <FiImage size={18} />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </label>

          {/* Text Input */}
          <input
            type="text"
            className="form-control flex-grow-1 p-2"
            style={{
              backgroundColor: "#f5f5f5",
              border: "none",
              borderRadius: "20px",
            }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
          />

          {/* Send Button */}
          <button
            type="submit"
            className="btn btn-dark rounded-pill p-2 ms-2"
            disabled={isUploading}
            onClick={sendMessage}
          >
            {isUploading ? "Uploading..." : "Send"}
          </button>
        </div>
      </div>

      {/* Fullscreen Image Preview */}
      {previewImage && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center"
          style={{ zIndex: 1050 }}
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Full Preview"
            style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: "8px" }}
          />
        </div>
      )}
    </div>
  );
}

function ChatMessage({ message, imageUrl, isSender, onClickImage }) {
  return (
    <div
      className={`d-flex ${
        isSender ? "justify-content-end" : "justify-content-start"
      } align-items-start my-2`}
    >
      <div
        className="px-3 py-2 d-flex flex-column"
        style={{
          backgroundColor: isSender ? "#d1f7c4" : "#f1f1f1",
          borderRadius: "16px",
          maxWidth: "60%",
          fontSize: "16px",
          lineHeight: "1.5",
          whiteSpace: "pre-wrap",
        }}
      >
        {/* Image at the Top */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Sent"
            style={{
              maxWidth: "100px",
              borderRadius: "8px",
              marginBottom: "5px",
              cursor: "pointer",
            }}
            onClick={onClickImage}
          />
        )}

        {/* Message Text Below the Image */}
        {message && <p className="m-0">{message}</p>}
      </div>
    </div>
  );
}

export default ChatBox;
