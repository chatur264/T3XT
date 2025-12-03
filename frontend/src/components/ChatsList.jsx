import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

function ChatsList() {
  const {
    getChatPartners,
    chatPartners,
    isUsersLoading,
    setSelectedUser,
    getLastConversation,
    lastConversationsMap,
    unreadMessagesMap,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  useEffect(() => {
    getChatPartners();
    getLastConversation();

    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, []);

  const { onlineUsers } = useAuthStore();

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chatPartners.length === 0) return <NoChatsFound />;

  return (
    <>
      {chatPartners.map((partner) => (
        <div
          key={partner._id}
          className="p-2 cursor-pointer   flex items-center gap-3"
          onClick={() => setSelectedUser(partner)}
        >
          <div className="flex items-center gap-3 relative">
            <div
              className={`size-11 rounded-full overflow-hidden avatar-${
                onlineUsers.includes(partner._id) ? "online" : ""
              }`}
            >
              <img
                src={partner.profilePic || "/avatar.png"}
                alt={partner.fullName}
                className="w-10 rounded-full"
              />
            </div>
          </div>

          <div className="w-full">
            <h4 className="text-slate-200 text-sm truncate font-semibold">
              {partner.fullName}
            </h4>

            <div className="w-full flex justify-between items-center">
              <p className=" text-gray-400 text-[11px] truncate w-55">
                {lastConversationsMap[partner._id] || "No messages yet"}
              </p>
              {unreadMessagesMap[partner._id] > 0 && (
                <div className="bg-green-600 flex justify-center items-center w-4 h-4 rounded-full">
                  <p className="text-[10px]">
                    {unreadMessagesMap[partner._id]}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
export default ChatsList;
