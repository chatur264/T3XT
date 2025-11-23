import { create } from "zustand"

export const useAuthStore = ((set, get) => ({
    authUser: {
        name: "Sachin",
        _id: 123,
        age: 25
    },
    isLoading: true,

    login: () => {
        console.log("We are logged in");
    }

}))