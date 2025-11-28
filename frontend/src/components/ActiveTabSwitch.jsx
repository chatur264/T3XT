import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="tabs tabs-boxed w-full ">
      <button
        onClick={() => setActiveTab("chats")}
        className={`tab w-1/2 rounded-full ${
          activeTab === "chats" ? " text-cyan-400 " : "text-slate-400"
        }`}
      >
        Chats
      </button>

      <button
        onClick={() => setActiveTab("contacts")}
        className={`tab w-1/2 rounded-full ${
          activeTab === "contacts" ? " text-cyan-400" : "text-slate-400 "
        }`}
      >
        Contacts
      </button>
    </div>
  );
}
export default ActiveTabSwitch;