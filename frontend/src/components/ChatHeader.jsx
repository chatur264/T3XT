import { XIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div
      className="flex justify-between items-center border-b rounded-tr-lg
   border-slate-700/50 max-h-[65px] px-4 flex-1 bg-slate-800/50"
    >
      <div className="flex justify-center items-center gap-3">
        <div className="flex items-center space-x-3 h-100px relative">
          <div
            className={`size-12 avatar-${
              onlineUsers.includes(selectedUser._id) ? "online" : ""
            }`}
          >
            <div className="w-11 rounded-full overflow-hidden object-cover flex gap-3">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-slate-200 font-medium">
            {selectedUser.fullName}
          </h3>
          <p className="text-xs text-green-400">
            {onlineUsers.includes(selectedUser._id) ? "Online" : ""}
          </p>
        </div>
      </div>

      <button onClick={() => setSelectedUser(null)}>
        <XIcon className="w-4 h-4 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
      </button>
    </div>
  );
}
export default ChatHeader;
