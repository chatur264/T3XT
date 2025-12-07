import { useEffect, useRef, useState } from "react";
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

  const [previewImage, setPreviewImage] = useState(null);

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

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-14 ">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="m space-y-8">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat relative ${
                  msg.senderId === authUser._id ? "chat-end" : "chat-start "
                }`}
              >
                <div
                  className={`chat-bubble rounded-tr-4xl rounded-tl-4xl  px-4 py-4 ${
                    msg.senderId === authUser._id
                      ? "bg-cyan-600 text-white rounded-bl-4xl"
                      : "bg-slate-800 text-slate-200 rounded-br-4xl"
                  }`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Shared"
                      className="rounded-lg h-48 object-cover cursor-pointer"
                      onClick={() => setPreviewImage(msg.image)}
                    />
                  )}

                  {msg.text && (
                    <p className="mt-1 break-normal whitespace-normal">
                      {msg.text}
                    </p>
                  )}

                  {/* See image in full screen and download  */}
                  {previewImage && (
                    <div
                      className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
                      onClick={() => setPreviewImage(null)}
                    >
                      <img
                        src={previewImage}
                        className="max-w-[90vw] max-h-[90vh] rounded shadow"
                      />

                      <a
                        href={previewImage}
                        download
                        onClick={(e) => e.stopPropagation()}
                        className="absolute bottom-6 bg-slate-900 text-white px-2 py-1 rounded"
                      >
                        Download
                      </a>
                    </div>
                  )}

                  <p
                    className={`text-[8px] opacity-75 flex mt-1 ${
                      msg.senderId === authUser._id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>

                <div
                  className={`absolute  ${
                    msg.senderId === authUser._id ? "-right-10" : "-left-10"
                  } -bottom-3`}
                >
                  <img
                    src={
                      (msg.senderId === authUser._id
                        ? authUser.profilePic
                        : selectedUser.profilePic) || "/avatar.png"
                    }
                    className="size-8 rounded-full overflow-hidden object-cover"
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
