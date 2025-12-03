import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

function ChatsList() {
  const { getAllContacts, allContacts, isUsersLoading, setSelectedUser } =
    useChatStore();

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
          className="cursor-pointer  p-2 flex items-center gap-3"
          onClick={() => setSelectedUser(contact)}
        >
          <div className="flex items-center gap-3 relative ">
            <div className="size-10 rounded-full overflow-hidden object-cover">
              <img
                src={contact.profilePic || "/avatar.png"}
                alt={contact.fullName}
              />
            </div>
          </div>

          <h4 className="text-slate-200 text-sm truncate">
            {contact.fullName}
          </h4>
        </div>
      ))}
    </>
  );
}
export default ChatsList;
