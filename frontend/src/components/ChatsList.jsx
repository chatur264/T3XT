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
          className="p-2 cursor-pointer  hover:scale-103 hover:delay-100 hover:transition-all flex items-center gap-3"
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

          <div>
            <h4 className="text-slate-200 text-sm truncate">
              {partner.fullName}
            </h4>
            <p className="text-green-400 text-[10px]">
              {onlineUsers.includes(partner._id) ? "Online" : ""}
            </p>
          </div>
        </div>
      ))}
    </>
  );
}
export default ChatsList;
