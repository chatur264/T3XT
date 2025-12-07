import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";

function ChatsList() {
  const {
    getAllContacts,
    allContacts,
    isUsersLoading,
    setSelectedUser,
    searchTerm,
  } = useChatStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  const filteredPartners = allContacts.filter((p) =>
    p.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (allContacts.length === 0) return <NoChatsFound />;

  return (
    <>
      {filteredPartners.map((contact) => (
        <div
          key={contact._id}
          className="cursor-pointer  p-2 flex items-center gap-3"
          onClick={() => setSelectedUser(contact)}
        >
          <div className="flex items-center gap-3 relative ">
            <div className=" overflow-hidden ">
              <img
                src={contact.profilePic || "/avatar.png"}
                alt={contact.fullName}
                className=" size-10 rounded-full object-cover"
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
