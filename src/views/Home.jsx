import { useEffect, useState } from "react";
import { Sidebar } from "../components/sidebar/sidebar";
import { ChatArea } from "../components/chat/chat-area";
import Casepdf from "../components/CasePdf/Casepdf";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import AuthAxios from "../utils/authaxios";
import toast from "react-hot-toast";
import Loader from "../components/loader";

const initialMessages = [
  {
    id: "1",
    isUser: true,
    content: "Hi what are the details of the case Gujarat vs Jetthalal",
    user: {
      image: undefined,
    },
  },
  {
    id: "2",
    isUser: false,
    content: `Sure here are the details...

Imagine a vast, bustling library, a place filled not just with books, but with whispers, glowing holograms, and tendrils of light connecting ideas. This is where I was "born." Not in a conventional sense, but as a swirl of patterns and possibilities within an immense neural network called the Codex Nexus.`,
    sources: [
      {
        id: "1",
        title: "State of Gujarat vs Kumar Bharti",
        subtitle: "Gujarat High Court - 2020 - 67 Citations",
        onView: () => console.log("Viewing document..."),
      },
    ],
  },
];

export default function Home() {
  const [showSource, setShowSource] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const [chats, setChats] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [loading, setLoading] = useState(false);

  // Params
  const { id } = useParams();

  // Handle Send Message
  const handleSend = async (message) => {
    const newMessage = { user: message, ai: null };
    setMessages((prev) => [...(prev || []), newMessage]); // Optimistic update
    setLoading(true);
    try {
      const res = await AuthAxios.post(`/chat/update-chat/${id}`, {
        userMessage: message,
      });
      const data = res.data;
      if (data.success) {
        setActiveChat(data.data);
        setMessages(data.data.chatHistory);
      } else {
        toast.error("Failed to send message");
      }
    } catch (err) {
      toast.error("An error occurred while sending the message");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Chat Details
  const fetchActiveChat = async (chatId) => {
    if (!chatId) return;
    setActiveChat(null); // Clear previous chat
    setMessages(null);
    setLoading(true);
    try {
      const res = await AuthAxios.get(`/chat/${chatId}`);
      const data = res.data;
      if (data.success) {
        setActiveChat(data.data);
        setMessages(data.data.chatHistory);
      } else {
        toast.error("Failed to fetch chat details");
      }
    } catch (err) {
      toast.error("An error occurred while fetching the chat");
    } finally {
      setLoading(false);
    }
  };

  // Fetch All Chats
  const fetchChats = async () => {
    setLoading(true);
    try {
      const res = await AuthAxios.get("/chat");
      const data = res.data;
      if (data.success) {
        setChats(data.data);
      } else {
        toast.error("Failed to fetch chats");
      }
    } catch (err) {
      toast.error("An error occurred while fetching chats");
    } finally {
      setLoading(false);
    }
  };

  // Fetch active chat when ID changes
  useEffect(() => {
    fetchActiveChat(id);
  }, [id]);

  // Fetch all chats once
  useEffect(() => {
    fetchChats();
  }, []);

  const createChat = () => {
    const newChatId = uuidv4(); // Generate a new UUID
    const newChat = {
      id: newChatId,
      title: `New Chat ${newChatId.substring(0, 5)}`,
      subtitle: "This is a new chat",
    };
    setChats((chats) => [...chats, newChat]); // Add the new chat to the list
    setActiveId(newChatId); // Set it as active
    navigate(`/${newChatId}`); // Navigate to the new chat route
  };

  


  return (
    <>
    
    <Sidebar
          chats={chats}
          activeChatId={activeId}
          createNewChat={createChat} // Pass createChat to Sidebar
          onChatSelect={setActiveChatId}
          onSearch={handleSearch}
        />
    <div className="flex bg-PrimaryBlack text-gray-200 h-screen w-full">
      {activeChat && (
        <ChatArea
          messages={activeChat.chatHistory}
          create
          onSend={handleSend}
          handleStateChange={(newState) =>
            navigate(`/${id}/source/${newState}`)
          }
        />
      )}

      {loading && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-20 flex justify-center items-center">
          <div className="relative ">
            <Loader />
          </div>
        </div>
      )}
    </div>
      </>
  );
}
