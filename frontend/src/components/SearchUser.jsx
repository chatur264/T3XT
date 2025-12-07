import { useChatStore } from "../store/useChatStore";

const SearchUser = () => {
  const { setSearchTerm } = useChatStore();
  return (
    <div className="px-4">
      <label
        className="input outline-none w-full bg-slate-800/50 
             border border-slate-700/50 rounded-lg 
             flex items-center gap-2
             focus-within:border-blue-300 transition-colors 
             focus-within:border-2"
      >
        <svg
          className="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>

        <input
          type="search"
          required
          placeholder="Search"
          className="bg-transparent outline-none w-full"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </label>
    </div>
  );
};

export default SearchUser;
