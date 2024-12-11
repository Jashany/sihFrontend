import { useState } from "react";
import { Sidebar } from "../components/sidebar/sidebar";
import { ChatArea } from "../components/chat/chat-area";
import Casepdf from "../components/CasePdf/Casepdf";
import { useLocation,useParams,useNavigate } from "react-router-dom";


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

  //param
  const { id } = useParams();
  console.log(id)

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
    navigate(`/${id}/source/201959`)
  };

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
