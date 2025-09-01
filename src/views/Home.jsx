import { useEffect, useState } from "react";
import { Sidebar } from "../components/sidebar/sidebar";
import { ChatArea } from "../components/chat/chat-area";
import Casepdf from "../components/CasePdf/Casepdf";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import AuthAxios from "../utils/Authaxios";
import toast from "react-hot-toast";
import Loader from "../components/loader";
import { v4 as uuidv4 } from "uuid";
import { translateToEnglishV2 } from "../services/LanguageEnglish";


export default function Home() {
  const [showSource, setShowSource] = useState(null);
  const [chats, setChats] = useState(null);
  const [filteredChats, setFilteredChats] = useState(null); // Filtered chats
  const [activeChat, setActiveChat] = useState(null);
  const [activeId, setActiveId] = useState(null); // Active chat ID state
  const [messages, setMessages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Search term state

  const location = useLocation();
  const navigate = useNavigate();

  const { id } = useParams(); // Chat ID from URL params

const handleSend = async (message) => {
    // 1. Optimistic UI update for the user's message
    const userMessage = { user: message, ai: null, timestamp: new Date().toISOString() };
    
    // 2. Create a placeholder for the AI's response that we will update
    const aiPlaceholder = {
      user: null,
      ai: { text: "", sources: [] },
      isStreaming: true, // A flag to indicate this message is being streamed
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...(prev || []), userMessage, aiPlaceholder]);

    try {
      // 3. Use fetch to make the streaming request
      const token = localStorage.getItem("token"); // Or wherever you store your auth token
      const response = await fetch(`https://lawapi.jsondev.in/api/chat/update-chat/${id}`, { // Make sure API path is correct
        method: 'POST',
        credentials: 'include', // Include cookies if needed
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Manually add auth header
        },
        body: JSON.stringify({ userMessage: message }),
      });

      if (!response.ok || !response.body) {
        //i have message and success in response body res.status.json , show the message
        throw new Error(`Error: ${response.status} ${response.body.message}`);
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      // 4. Process the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break; // Stream finished
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop(); // Keep the last, possibly incomplete, line

        for (const line of lines) {
          if (line.startsWith('event: sources')) {
            const data = JSON.parse(line.split('data: ')[1]);
            setMessages((prev) =>
              prev.map((msg, index) =>
                index === prev.length - 1 ? { ...msg, ai: { ...msg.ai, sources: data } } : msg
              )
            );
          } else if (line.startsWith('event: chunk')) {
            const chunk = JSON.parse(line.split('data: ')[1]);
            setMessages((prev) =>
              prev.map((msg, index) =>
                index === prev.length - 1 ? { ...msg, ai: { ...msg.ai, text: msg.ai.text + chunk } } : msg
              )
            );
          }
        }
      }
    } catch (err) {
      console.error("Error during fetch:", err);
      //if err.message then show that else show generic and same setMessages update
      if (err.message) {
        toast.error(err.message);
      } else {
        toast.error("An error occurred while getting the response.");
      }
      //show err.message in the last ai message or a generic error
      setMessages((prev) =>
        prev.map((msg, index) =>
          index === prev.length - 1 ? { ...msg, ai: { text: err.message || "An error occurred while getting the response.", sources: [] }, isStreaming: false } : msg
        )
      );

    
    } finally {
        // 5. Finalize the message and refresh chat list
        setMessages((prev) =>
            prev.map((msg, index) =>
            index === prev.length - 1 ? { ...msg, isStreaming: false } : msg
            )
        );
        // We no longer need to manually fetch chats here, as the optimistic UI update is sufficient for the sidebar.
        // If you need a full refresh for other reasons, you can re-enable this.
        // fetchChats();
    }
  };

  // Fetch Chat Details
  const fetchActiveChat = async (chatId) => {
    if (!chatId) return;
    setLoading(true); // Show loader when switching chats
    setActiveChat(null); // Clear previous chat
    setMessages(null);
    try {
      const res = await AuthAxios.get(`/chat/${chatId}`);
      const data = res.data;
      if (data.success) {
        setActiveChat(data.data || null);
        setMessages(data.data.chatHistory || []);
      } else {
        toast.error("Failed to fetch chat details");
        navigate("/chat"); // Navigate away if chat fails to load
      }
    } catch (err) {
      toast.error("An error occurred while fetching the chat");
      navigate("/chat"); // Navigate away if chat fails to load
    } finally {
      setLoading(false);
    }
  };

  // Create New Chat
  const createChat = async () => {
    // Note: This is an optimistic creation. The chat isn't saved to the DB until the first message.
    const newChatId = uuidv4();
    navigate(`/chat/${newChatId}`);
  };

  // Filter Chats Based on Search
  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    if (!searchTerm) {
      setFilteredChats(chats);
      return;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    const filtered = chats.filter((chat) => {
      const firstUserMessage = chat.chatHistory?.[0]?.user?.toLowerCase();
      const secondAiMessage = chat.chatHistory?.[1]?.ai?.text?.toLowerCase();
      return (
        (firstUserMessage && firstUserMessage.includes(lowercasedTerm)) ||
        (secondAiMessage && secondAiMessage.includes(lowercasedTerm))
      );
    });
    setFilteredChats(filtered);
  };
  
  // Fetch active chat when ID changes
  useEffect(() => {
    if (id) {
      setActiveId(id);
      fetchActiveChat(id);
    }
  }, [id]);

  // Initial load effect
  useEffect(() => {
    const initialize = async () => {
      if (!localStorage.getItem("user")) {
        navigate("/login");
        return;
      }
      
      setLoading(true);
      try {
        const res = await AuthAxios.get("/chat");
        const data = res.data;
        if (data.success) {
          const allChats = data.data;
          setChats(allChats);
          setFilteredChats(allChats);

          // --- NEW LOGIC ---
          // If the user lands on the page without a specific chat ID...
          if (!id) {
            // ...and they have existing chats, redirect them to the first one.
            if (allChats && allChats.length > 0) {
              navigate(`/chat/${allChats[0].chatId}`, { replace: true });
            } else {
              // ...and they have NO existing chats, create a new one for them.
              createChat();
            }
          }
          // --- END NEW LOGIC ---

        } else {
          toast.error("Failed to fetch chats");
        }
      } catch (err) {
        toast.error("An error occurred while fetching chats");
      } finally {
        setLoading(false);
      }
    };
    
    initialize();
  }, []); // Run only once on initial mount

  return (
    // The parent div needs to be `flex` to lay out sidebar and chat area side-by-side
    <div className="flex h-screen w-full">
      <Sidebar
        chats={filteredChats}
        activeChatId={activeId}
        createNewChat={createChat}
        onSearch={handleSearch}
        onChatSelect={(chatId) => navigate(`/chat/${chatId}`)}
      />
      {/* The main content area */}
      <div className="flex-1 dark:bg-PrimaryBlack dark:text-gray-200 bg-PrimaryWhite text-black h-screen">
        {activeChat ? (
          <ChatArea
            messages={messages}
            onSend={handleSend}
            handleStateChange={(newState) =>
              navigate(`/chat/${id}/source/${newState}`)
            }
          />
        ) : (
          // You can show a loading state or a "Select a chat" message here
          !loading && <div className="flex items-center justify-center h-full">Select or create a new chat to begin.</div>
        )}

        {loading && (
          <div className="absolute inset-0 z-50 bg-black bg-opacity-20 flex justify-center items-center">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
}