import { XIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers, socket } = useAuthStore();
  const [isTyping, setIsTyping] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  useEffect(() => {
    if (!socket || !selectedUser) return;
    socket.on("typing", ({ from }) => {
      if (from === selectedUser._id) {
        setIsTyping(true);
      }
    });

    socket.on("stopTyping", ({ from }) => {
      if (from === selectedUser._id) {
        setIsTyping(false);
      }
    });

    return () => {
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [selectedUser]);

  const formatLastSeen = (isoString) => {
    if (!isoString) return "";

    const date = new Date(isoString);
    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    // format time into AM/PM
    const timeString = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    if (isToday) {
      return `Last seen today at ${timeString}`;
    }

    if (isYesterday) {
      return `Last seen yesterday`;
    }

    // same year?
    if (date.getFullYear() === now.getFullYear()) {
      return `Last seen ${date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
      })}`;
    }

    // different year
    return `Last seen ${date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}`;
  };

  return (
    <div
      className="flex justify-between items-center border-b 
   border-slate-700/50 max-h-[65px] px-4 flex-1 bg-slate-800/50"
    >
      <div className="flex justify-center items-center gap-4">
        <div className="flex items-center space-x-3 h-100px relative">
          <div
            className={`${
              onlineUsers.includes(selectedUser._id) ? "avatar-online" : ""
            }`}
          >
            <div className="flex gap-3 rounded-full ">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
                className="size-11 rounded-full object-cover cursor-pointer"
                onClick={() => setPreviewImage(selectedUser.profilePic)}
              />
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-slate-200 font-medium">
            {selectedUser.fullName}
          </h3>
          <p
            className={`text-xs ${
              onlineUsers.includes(selectedUser._id) || isTyping
                ? "text-green-400"
                : "text-white/70 text-[10px]"
            }`}
          >
            {onlineUsers.includes(selectedUser._id)
              ? isTyping
                ? "Typing..."
                : "Online"
              : formatLastSeen(selectedUser.lastSeen)}
          </p>
        </div>
        {/* See image in DP screen and download  */}
        {previewImage && (
          <div
            className="fixed inset-0 bg-black/70 flex justify-center items-center z-100"
            onClick={() => setPreviewImage(null)}
          >
            <img
              src={previewImage}
              className="max-w-[90vw] max-h-[90vh] rounded shadow"
            />
          </div>
        )}
      </div>

      <button onClick={() => setSelectedUser(null)}>
        <XIcon className="w-4 h-4 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
      </button>
    </div>
  );
}
export default ChatHeader;
