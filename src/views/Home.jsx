import { useEffect, useState } from "react";
import { Sidebar } from "../components/sidebar/sidebar";
import { ChatArea } from "../components/chat/chat-area";
import Casepdf from "../components/CasePdf/Casepdf";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import AuthAxios from "../utils/authaxios";
import toast from "react-hot-toast";

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
  const [activeId, setActiveId] = useState(null);
  
  //param
  const { id } = useParams();
  console.log(id);
  const [activeChatId, setActiveChatId] = useState(id);

  const [messages, setMessages] = useState(null);
  
  const handleSearch = (query) => {
    console.log("Searching:", query);
  };

  const handleSend = async (message) => {
    const newMessage = {
      id: String(messages.length + 1),
      isUser: true,
      content: message,
      user: message
    };
    setMessages([...messages, newMessage]);
    setLoading(true);
    const res = await AuthAxios.post("/chat/update-chat/"+activeChatId, {
      userMessage: message
    })
    setLoading(false);
    
    const data = res.data;
    if(data.success){
      console.log("Message sent successfully");
      setActiveChat(data.data);
      setMessages(data.data.chatHistory);
    }
    else{
      toast.error("Failed to send message");
    }


  };

  const handleStateChange = (newState) => {
    // navigate(`/${id}/source/${newState}`)
    navigate(`/${id}/source/201959`);
  };

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const res = await AuthAxios.get("/chat/"+activeChatId);
      const data = res.data;
      setLoading(false);

      if(data.success){
        setActiveChat(data.data);
        setMessages(data.data.chatHistory); 
      }
      else{
        toast.error("Failed to fetch chats");
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const res = await AuthAxios.get("/chat");
      const data = res.data;
      setLoading(false);

      if(data.success){
        setChats(data.data);
      }
      else{
        toast.error("Failed to fetch chats");
      }
    };
    fetch();
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

      {
        activeChat && (
          <ChatArea
          messages={activeChat.chatHistory}
          create
          onSend={handleSend}
          handleStateChange={handleStateChange}
        />
        )
      }
      
    </div>
      </>
  );
}
