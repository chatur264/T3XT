import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import MessageInput from "./MessageInput";

const ChatContainer = () => {
  const { selectedUser, getMessagesByUserId, messages, isMessagesLoading } =
    useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
  }, [selectedUser]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col justify-end h-full">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-14 ">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat relative ${
                  msg.senderId === authUser._id ? "chat-end" : "chat-start "
                }`}
              >
                <div
                  className={`chat-bubble px-3 py-2 ${
                    msg.senderId === authUser._id
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-800 text-slate-200"
                  }`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Shared"
                      className="rounded-lg h-48 object-cover"
                    />
                  )}

                  {msg.text && <p className="mt-2">{msg.text}</p>}

                  <p className="text-[9px] mt-1 opacity-75 flex gap-1 justify-end">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>

                <div
                  className={`absolute ${
                    msg.senderId === authUser._id ? "-right-10" : "-left-10"
                  } -bottom-3`}
                >
                  <img
                    src={msg.senderId === authUser._id ?authUser.profilePic:selectedUser.profilePic || "/avatar.png"}
                    alt={authUser.fullName}
                    className="w-8 rounded-full"
                  />
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
