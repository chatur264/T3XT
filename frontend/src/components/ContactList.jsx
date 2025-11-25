import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

function ChatsList() {
  const { getAllContacts, allContacts, isUsersLoading, setSelectedUser } =
    useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (allContacts.length === 0) return <NoChatsFound />;

  return (
    <>
      {allContacts.map((contact) => (
        <div
          key={contact._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors flex items-center gap-3"
          onClick={() => setSelectedUser(contact)}
        >
          <div className="flex items-center gap-3 relative ">
            <div className="size-12 rounded-full avatar-online">
              <img
                src={contact.profilePic || "/avatar.png"}
                alt={contact.fullName}
              />
            </div>
          </div>

          <h4 className="text-slate-200 font-medium truncate">
            {contact.fullName}
          </h4>
        </div>
      ))}
    </>
  );
}
export default ChatsList;
