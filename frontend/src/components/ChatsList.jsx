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
    subscribeToMessages,
    unsubscribeFromMessages,
    searchTerm,
  } = useChatStore();

  useEffect(() => {
    getChatPartners();
    getLastConversation();
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, []);

  const { onlineUsers } = useAuthStore();

  const formatMessageTimestamp = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) {
      // Show time in am/pm
      return date.toLocaleString("en-GB", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    }

    // Not today → show date
    return date.toLocaleDateString("en-GB", {
      month: "2-digit", //"short"
      year: "2-digit", //"numeric"
      day: "2-digit",
    });
  };

  const filteredPartners = chatPartners.filter((p) =>
    p.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chatPartners.length === 0) return <NoChatsFound />;

  return (
    <>
      {filteredPartners.map((partner) => (
        <div
          key={partner._id}
          className="p-2 cursor-pointer flex items-center gap-3"
          onClick={() => setSelectedUser(partner)}
        >
          <div className="flex items-center gap-3 relative">
            <div
              className={`size-11 rounded-full overflow-hidden ${
                onlineUsers.includes(partner._id) ? "avatar-online" : ""
              }`}
            >
              <img
                src={partner.profilePic || "/avatar.png"}
                alt={partner.fullName}
                className="size-10 rounded-full object-cover"
              />
            </div>
          </div>

          <div className="w-full ">
            <div className="flex justify-between items-center">
              <h4 className="text-slate-200 text-sm truncate font-semibold">
                {partner.fullName}
              </h4>
              <p className="text-[8px]">
                {formatMessageTimestamp(
                  lastConversationsMap[partner._id]?.lastMessageTime
                )}
              </p>
            </div>

            <div className="w-full flex justify-between items-center">
              <p className=" text-gray-400 text-[11px] truncate w-40">
                {lastConversationsMap[partner._id]?.lastMessageText ||
                  "📷 Photo"}
              </p>
              {lastConversationsMap[partner._id]?.unreadMessages > 0 && (
                <div className="bg-green-600 flex justify-center items-center w-4 h-4 rounded-full">
                  <p className="text-[10px]">
                    {lastConversationsMap[partner._id]?.unreadMessages}
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
