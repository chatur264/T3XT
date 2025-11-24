import { useAuthStore } from "../store/useAuthStore";

const ChatPage = () => {
  const { logout } = useAuthStore();
  return (
    <div className="z-100">
      ChatPage
      <button
        className="bg-red-400 ml-5"
        onClick={(e) => logout()}
      >
        logout
      </button>
    </div>
  );
};

export default ChatPage;
