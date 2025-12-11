function MessagesLoadingSkeleton() {
  return (
    <div className=" mx-auto space-y-2 p-2 sm:p-4">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className={`chat ${
            index % 2 === 0 ? "chat-start" : "chat-end"
          } animate-pulse`}
        >
          <div className="chat-bubble bg-slate-800 text-white w-36  h-18 "></div>
        </div>
      ))}
    </div>
  );
}
export default MessagesLoadingSkeleton;
