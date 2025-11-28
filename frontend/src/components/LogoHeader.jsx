import { MessageCircleCodeIcon, MessageCircleIcon, Volume2Icon, VolumeOffIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

const LogoHeader = () => {
    const { isSoundEnabled, toggleSound } = useChatStore();
  return (
    <div className="border-b border-slate-700/50 bg-slate-900 flex justify-between items-center p-3 science-gothic-sg">
      <div className="flex  items-center  gap-2">
        <MessageCircleIcon className="size-10" />
        <h1 className="text-2xl font-extrabold">T3XT</h1>
      </div>

      {/* SOUND TOGGLE BTN */}
      <button
        className="text-slate-400 hover:text-slate-200 transition-colors"
        onClick={() => {
          // play click sound before toggling
          mouseClickSound.currentTime = 0; // reset to start
          mouseClickSound
            .play()
            .catch((error) => console.log("Audio play failed:", error));
          toggleSound();
        }}
      >
        {isSoundEnabled ? (
          <Volume2Icon className="size-4" />
        ) : (
          <VolumeOffIcon className="size-4" />
        )}
      </button>
    </div>
  );
};

export default LogoHeader;
