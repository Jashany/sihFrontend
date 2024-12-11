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
  const [activeChatId, setActiveChatId] = useState("1");
  const [messages, setMessages] = useState(initialMessages);
  const [showSource, setShowSource] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const [chats, setChats] = useState(null);
  const [activeChat, setActiveChat] = useState(null);

  //param
  const { id } = useParams();
  console.log(id);

  const handleSearch = (query) => {
    console.log("Searching:", query);
  };

  const handleSend = (message) => {
    const newMessage = {
      id: String(messages.length + 1),
      isUser: true,
      content: message,
      user: {
        image: undefined,
      },
    };
    setMessages([...messages, newMessage]);
  };

  const handleStateChange = (newState) => {
    // navigate(`/${id}/source/${newState}`)
    navigate(`/${id}/source/201959`);
  };

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const res = await AuthAxios.get("/chat/chats");
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

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const res = await AuthAxios.get("/chat/chats");
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




  return (
    <div className="flex bg-PrimaryBlack text-gray-200 h-screen">
      <ChatArea
        messages={messages}
        create
        onSend={handleSend}
        handleStateChange={handleStateChange}
      />
    </div>
  );
}
