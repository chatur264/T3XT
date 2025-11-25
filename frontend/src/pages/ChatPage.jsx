import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatContainer from "../components/ChatContainer";
import ChatList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import NoConversionsationPlaceholder from "../components/NoConversionsationPlaceholder";
import ProfileHeader from "../components/ProfileHeader";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatPage = () => {
  const { activeTab, selectedUser } = useChatStore();

  return (
    <div className="w-full flex items-center justify-center  bg-slate-900 min-h-screen">
      <div className="relative w-full max-w-[80%] md:h-[800px] bg-slate-900 rounded-lg  border-slate-800/40 shadow-md">
        <div className="w-full flex flex-row justify-center items-center h-full ">
          {/* Left  */}
          <div className=" w-1/4  bg-linear-to-bl from-slate-800/60 to-transparent h-full flex flex-col p-2">
            <ProfileHeader />
            <ActiveTabSwitch />
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {activeTab === "chats" ? <ChatList /> : <ContactList />}
            </div>
          </div>

          {/* Right  */}
          <div className="w-3/4 border-r border-slate-900/40 h-full">
            <div className=" h-full">
              {selectedUser ? (
                <ChatContainer />
              ) : (
                <NoConversionsationPlaceholder />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
