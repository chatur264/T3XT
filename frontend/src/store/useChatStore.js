import toast from "react-hot-toast";
import { create } from "zustand"
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    allContacts: [],
    chatPartners: [],
    searchTerm: "",
    setSearchTerm: (value) => set({ searchTerm: value }),

    lastConversationsMap: {},

    messages: [],
    activeTab: 'chats',//by default chats partners tab
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    //we will store it in local storage so that we can keep it alive if user refreshes/leave the page
    isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

    toggleSound: () => {
        //update the localStorege
        localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
        //then update the for UI
        set({ isSoundEnabled: !get().isSoundEnabled })
    },

    setActiveTab: (tab) => {
        set({ activeTab: tab })
    },

    setSelectedUser: (selectedUser) => {
        set({ selectedUser });

        const socket = useAuthStore.getState().socket;
        socket.emit("openChat", { chatWith: selectedUser ? selectedUser._id : null });

        if (selectedUser) {
            set((state) => {
                const updated = { ...state.lastConversationsMap };

                if (updated[selectedUser._id]) {
                    updated[selectedUser._id] = {
                        ...updated[selectedUser._id],
                        unreadMessages: 0,
                    };
                }

                return { lastConversationsMap: updated };
            });
        }
    },

    getAllContacts: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/message/contacts");
            set({ allContacts: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getChatPartners: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/message/chats");
            set({ chatPartners: res.data });
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message || "Something went wrong");
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessagesByUserId: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message || "Something went wrong");
        } finally {
            set({ isMessagesLoading: false });
        }
    },


    getLastConversation: async () => {
        const { authUser } = useAuthStore.getState();
        try {
            const res = await axiosInstance.get("/message/lastConversation");

            const map = {};
            res.data?.forEach(c => {
                const partnerId = c.participants.find(id => id !== authUser._id);
                const lastSender = c.lastMessageSenderId;
                map[partnerId] = {
                    lastMessageText: c.lastMessageText,
                    unreadMessages: lastSender === authUser._id
                        ? 0
                        : c.unreadMessages,
                    lastMessageTime: new Date(c.lastMessageTime).getTime()
                };
            });

            set({ lastConversationsMap: map });
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        }
    },

    updateUserLastSeen: (userId, lastSeen) => {
        const { selectedUser } = get();

        // Only update UI if the opened chat is the same user
        if (selectedUser?._id === userId) {
            set({
                selectedUser: {
                    ...selectedUser,
                    lastSeen,
                }
            });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        const { authUser } = useAuthStore.getState();

        const tempId = `temp-${Date.now()}`;

        const optimisticMessage = {
            _id: tempId,
            senderId: authUser._id,
            receiverId: selectedUser._id,
            text: messageData.text,
            image: messageData.image,
            createdAt: new Date().toISOString(),
            isOptimistic: true, // flag to identify optimistic messages (optional)
        };
        // immidetaly update the ui by adding the message
        set({ messages: [...messages, optimisticMessage] });

        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
            set({ messages: messages.concat(res.data) });
        } catch (error) {
            // remove optimistic message on failure
            set({ messages: messages });
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },

    subscribeToMessages: () => {
        const socket = useAuthStore.getState().socket;

        socket.off("newMessage"); // prevent multiple listeners

        socket.on("newMessage", (newMessage) => {
            const { selectedUser, isSoundEnabled } = get();

            // 1. Add message if the selected user is same
            if (selectedUser &&
                (newMessage.senderId === selectedUser._id)
            ) {
                const currentMessages = get().messages;
                set({ messages: [...currentMessages, newMessage] });
            }

            // 2. UPDATE lastMessageMap(always update)+unread message(if receiver hasn't selected the sender) 
            const loggedIn = useAuthStore.getState().authUser._id;
            const partnerId =
                newMessage.senderId === loggedIn
                    ? newMessage.receiverId
                    : newMessage.senderId;

            const isUserSelected = selectedUser && selectedUser._id === partnerId;

            //online unread msg notification
            if (!isUserSelected && isSoundEnabled) {
                const sound = new Audio("/sounds/notification.mp3");
                sound.currentTime = 0;
                sound.play().catch(() => { });
            }
            set((state) => {
                const oldData = state.lastConversationsMap[partnerId] || {
                    lastMessageText: "",
                    unreadMessages: 0,
                    lastMessageTime: new Date(newMessage.createdAt).getTime()
                };


                const updatedMap = {
                    ...state.lastConversationsMap,
                    [partnerId]: {
                        lastMessageText: newMessage.text,
                        unreadMessages: isUserSelected ? 0 : oldData.unreadMessages + 1,
                        lastMessageTime: new Date(newMessage.createdAt).getTime()
                    }
                };


                const sortedPartners = [...state.chatPartners].sort((a, b) => {
                    const t1 = updatedMap[a._id.toString()]?.lastMessageTime || 0;
                    const t2 = updatedMap[b._id.toString()]?.lastMessageTime || 0;
                    return t2 - t1;
                });
                console.log(sortedPartners);


                return {
                    lastConversationsMap: updatedMap,
                    chatPartners: sortedPartners
                };

            });

        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },
}))