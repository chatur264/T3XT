import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

function ChatsList() {
  const { getChatPartners, chatPartners, isUsersLoading, setSelectedUser } =
    useChatStore();

  useEffect(() => {
    getChatPartners();
  }, [getChatPartners]);
  const { onlineUsers } = useAuthStore();
  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chatPartners.length === 0) return <NoChatsFound />;

  return (
    <>
      {chatPartners.map((partner) => (
        <div
          key={partner._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors flex items-center gap-3"
          onClick={() => setSelectedUser(partner)}
        >
          <div className="flex items-center gap-3 relative">
            <div
              className={`size-12 rounded-full overflow-hidden avatar-${
                onlineUsers.includes(partner._id) ? "online" : ""
              }`}
            >
              <img
                src={partner.profilePic || "/avatar.png"}
                alt={partner.fullName}
              />
            </div>
          </div>

          <h4 className="text-slate-200 font-medium truncate">
            {partner.fullName}
          </h4>
        </div>
      ))}
    </>
  );
}
export default ChatsList;
