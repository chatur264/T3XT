import { useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { LogOutIcon, Volume2Icon, VolumeOffIcon } from "lucide-react";

const ProfileHeader = () => {
  const { logout, authUser, updateProfile } = useAuthStore();

  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };
  return (
    <div className="p-3 border-t border-slate-700/50 bg-slate-900">
      <div className="flex items-center justify-between">
        {/* Profile image & User  */}
        <div className="flex justify-center items-center gap-2">
          {/* AVATAR */}

          <button
            className="size-12 rounded-full overflow-hidden relative group"
            onClick={() => fileInputRef.current.click()}
          >
            <img
              src={selectedImage || authUser.profilePic || "/avatar.png"}
              alt="User image"
              className="w-11 h-11 rounded-full object-cover "
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity ">
              <span className="text-white text-xs ">Change</span>
            </div>
          </button>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* USERNAME & ONLINE TEXT */}
          <div>
            <h3 className=" text-slate-200 max-w-[180px] truncate text-base sm:text-xs xl:text-base">
              {authUser?.fullName}
            </h3>
            <p className="text-green-500 text-xs sm:text-[10px] xl:text-xs">Online</p>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 items-center ">
          {/* LOGOUT BTN */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={logout}
          >
            <LogOutIcon className="size-4 sm:size-3 xl:size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
