import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid"; // Import UUID
import Home from "./views/Home";
import MainSideBar from "./components/MainSideBar/MainSideBar";
import UploadDocument from "./views/UploadDocument";
import Casepdf from "./components/CasePdf/Casepdf";
import { Sidebar } from "./components/sidebar/sidebar";
import NotebookPage from "./views/Notebook";
import { Toaster } from "react-hot-toast";
import RegisterPage from "./views/Register";
import LoginPage from "./views/Login";
import AuthAxios from "./utils/authaxios";

const initialChats = [
  {
    id: "1",
    title: "Gujarat State vs Jetthalal",
    subtitle: "Gujarat State vs Jetthalal was an amazing case about...",
  },
  {
    id: "2",
    title: "Gujarat State vs Dhanji",
    subtitle: "Gujarat State vs Dhanji was an amazing case about...",
  },
];

export default function App() {
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  
  const [chats, setChats] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(false);

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



  // Redirect to a new chat ID if user lands on "/"
  useEffect(() => {
    if (location.pathname === "/") {
      createChat(); // Automatically create a new chat if landing on "/"
    }
  }, [location.pathname]);

  // Function to create a new chat
  const createChat = async () => {
    const newChatId = await uuidv4(); // Generate a new UUID
    const newChat = {
      chatId: newChatId,
      title: `New Chat ${newChatId.substring(0, 5)}`,
      subtitle: "This is a new chat",
    };
  
    setChats((prevChats) => {
      const updatedChats = [...prevChats, newChat];
      return updatedChats;
    });
  
    setActiveId(newChatId); // Set it as active
    navigate(`/${newChatId}`); // Navigate to the new chat route
  };
  

  const setActiveChatId = (id) => {
    setActiveId(id);
    navigate(`/${id}`);
  };

  const handleSearch = (query) => {
    console.log("Searching:", query);
  };

  console.log(location.pathname);
  return (
    <div className="flex h-[100vh]">
      <Toaster position="top-right" reverseOrder={false} />
      <MainSideBar />
      {!(
        location.pathname === "/upload" ||
        location.pathname === "/register" ||
        location.pathname === "/login" ||
        location.pathname === "/login"
      ) && (
        <Sidebar
          chats={chats}
          activeChatId={activeId}
          createNewChat={createChat} // Pass createChat to Sidebar
          onChatSelect={setActiveChatId}
          onSearch={handleSearch}
        />
      )}

      <Routes>
        <Route path="/:id" element={<Home />} />
        <Route path="/:id/source/:source" element={<Casepdf />} />
        <Route path="/upload" element={<UploadDocument />} />
        <Route path="/notebook" element={<NotebookPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}
