import toast from "react-hot-toast";
import { create } from "zustand"
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    allContacts: [],
    chatPartners: [],

    lastConversationsMap: {},
    unreadMessagesMap: {},

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
        // Open chat → clear unread for this user
        const unread = get().unreadMessagesMap;
        set({ selectedUser }) //OR ({selectedUser})

        if (selectedUser && unread[selectedUser._id]) {
            set((state) => {
                const updated = { ...state.unreadMessagesMap };
                delete updated[selectedUser._id];
                return { unreadMessagesMap: updated };
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
                map[partnerId] = c.lastMessageText;
            });

            set({ lastConversationsMap: map });
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message || "Something went wrong");
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

                //Play sound then
                if (isSoundEnabled) {
                    const sound = new Audio("/sounds/notification.mp3");
                    sound.currentTime = 0;
                    sound.play().catch(() => { });
                }
            }

            // 2. UPDATE lastMessageMap (always update)
            const loggedIn = useAuthStore.getState().authUser._id;
            const partnerId =
                newMessage.senderId === loggedIn
                    ? newMessage.receiverId
                    : newMessage.senderId;

            if (!selectedUser || selectedUser._id !== partnerId) {
                // user not selected → unread++
                set((state) => ({
                    unreadMessagesMap: {
                        ...state.unreadMessagesMap,
                        [partnerId]: (state.unreadMessagesMap[partnerId] || 0) + 1,
                    },
                }));
                //Play sound then
                if (isSoundEnabled) {
                    const sound = new Audio("/sounds/notification.mp3");
                    sound.currentTime = 0;
                    sound.play().catch(() => { });
                }
            }
            set((state) => ({
                lastConversationsMap: {
                    ...state.lastConversationsMap,
                    [partnerId]: newMessage.text
                }
            }));
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },
}))