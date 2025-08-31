import { useState } from "react";
import { Menu, X ,MessageSquare} from "lucide-react"; // Import hamburger and close icons
import { SearchBar } from "./search-bar";

import { ChatListItem } from "./chat-list-item";
import penchat from "../../assets/svgs/pen-chat.svg";
import chat from "../../assets/svgs/chatgray.svg";

export function Sidebar({
  chats,
  activeChatId,
  onChatSelect,
  onSearch,
  createNewChat,
  onChatDelete,
}) {
  // State to control sidebar visibility on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Wrapper function to close sidebar on mobile after a chat is selected
  const handleChatSelect = (chatId) => {
    onChatSelect(chatId);
    if (window.innerWidth < 768) { // md breakpoint
      setIsSidebarOpen(false);
    }
  };

  // Wrapper function to close sidebar on mobile after creating a new chat
  const handleCreateNewChat = () => {
    createNewChat();
    if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
    }
  }

  return (
    <>
      {/* HAMBURGER BUTTON - visible only on mobile */}
      <button
        className="md:hidden p-2 fixed top-4 left-20 z-20  bg-DarkBlue/80 dark:bg-PrimaryBlack/80 text-white  rounded-full backdrop-blur-sm"
        onClick={() => setIsSidebarOpen(true)}
      >
        <MessageSquare size={28} />
      </button>

      {/* OVERLAY - visible only on mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* SIDEBAR CONTAINER */}
      <div
        className={`
          dark:bg-PrimaryGrayDark bg-TertiaryWhite h-screen flex flex-col z-50
          transition-transform duration-300 ease-in-out
          
          fixed w-4/5 max-w-sm top-0 left-0 md:relative md:w-[400px] md:min-w-[400px] md:translate-x-0
          md:border-r md:dark:border-gray-700 md:border-gray-200
          
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header Section */}
        <div className="p-4 flex justify-between items-center">
          <h1 className="dark:text-gray-200 text-DarkBlue font-semibold">Chats</h1>
          {/* CLOSE BUTTON - visible only on mobile */}
          <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
            <X className="h-6 w-6 dark:text-gray-200 text-DarkBlue" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center">
          <SearchBar onSearch={onSearch} />
          <button
            className="bg-PrimaryBlue p-2.5 mr-3 rounded-lg"
            onClick={handleCreateNewChat} // Use the wrapper function
          >
            <img src={penchat} alt="New Chat" width={18} height={10} />
          </button>
        </div>

        {/* Chats List */}
        <div className="flex-1 overflow-y-auto pl-5 pt-3 scrollbar-minimal">
          <h1 className="text-[#676767] flex gap-1 pb-2">
            <img src={chat} alt="Chats Icon" />
            Recent Chats
          </h1>
          <div className="overflow-y-auto h-[92%] flex flex-col gap-3 scrollbar-thin scrollbar-thumb-PrimaryGrayDark scrollbar-track-PrimaryGrayLight">
            {chats && chats.length > 0 ? (
              chats.map((chat) => {
                const firstMessage = chat.chatHistory?.[0]?.user || "New Chat...";
                const secondMessage =
                  chat.chatHistory?.[1]?.ai?.text || "Start a new chat";

                return (
                  <ChatListItem
                    key={chat.chatId}
                    title={firstMessage}
                    subtitle={secondMessage}
                    isActive={chat.chatId === activeChatId}
                    onClick={() => handleChatSelect(chat.chatId)} // Use the wrapper function
                    onDelete={() => onChatDelete(chat.chatId)}
                  />
                );
              })
            ) : (
              <div className="text-PrimaryGrayTextLight">No Chats Found</div>
            )}
          </div>
        </div>

        {/* Footer */}
        <button className="p-4 text-gray-400 hover:text-gray-200 transition-colors">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>
    </>
  );
}

export default Sidebar;