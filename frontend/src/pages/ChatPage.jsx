import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatContainer from "../components/ChatContainer";
import ChatList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import LogoHeader from "../components/LogoHeader";
import NoConversionsationPlaceholder from "../components/NoConversionsationPlaceholder";
import ProfileHeader from "../components/ProfileHeader";
import SearchUser from "../components/SearchUser";
import { useChatStore } from "../store/useChatStore";

const ChatPage = () => {
  const { activeTab, selectedUser } = useChatStore();

  return (
    <div className="relative w-full h-full bg-slate-900">
      <div className="w-full flex flex-row justify-center items-center h-full">
        {/* Left  */}
        <div
          className={`w-full 
         ${selectedUser ? "hidden" : "block"} 
        sm:flex
        sm:w-[50vw] md:w-[40vw] lg:w-[35vw] xl:w-[28vw] 
        bg-linear-to-bl from-slate-800/60 to-transparent 
        h-full flex flex-col border-r border-slate-700/50`}
        >
          <LogoHeader />
          <ActiveTabSwitch />
          <SearchUser />

          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {activeTab === "chats" ? <ChatList /> : <ContactList />}
          </div>

          <ProfileHeader />
        </div>

        {/* Right  */}
        <div
          className={`
            w-full 
            ${selectedUser ? "block" : "hidden"} 
            sm:block 
            border-r border-slate-900/40 h-full
          `}
        >
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
  );
};

export default ChatPage;
