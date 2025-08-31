// src/layouts/DashboardLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import MainSideBar from '../components/MainSideBar/MainSideBar';
import NotebookWriter from '../components/notebook/NoteBookWriter';
import AuthAxios from '../utils/Authaxios';

const DashboardLayout = ({ isContrast, setIsContrast }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Chat management logic is now correctly placed inside the protected area
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchChats = async () => {
    setLoading(true);
    try {
      const res = await AuthAxios.get("/chat");
      if (res.data.success) {
        setChats(res.data.data);
        return res.data.data; // Return the chats
      } else {
        toast.error("Failed to fetch chats");
        return [];
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
      toast.error("Session may have expired. Please log in again.");
      // Handle logout logic if needed
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  const createChat = () => {
    const newChatId = uuidv4();
    // Navigate to the new chat route. The Home component will handle the rest.
    navigate(`/${newChatId}`);
  };

  useEffect(() => {
    // This effect handles the initial entry into the dashboard.
    const initializeDashboard = async () => {
      const fetchedChats = await fetchChats();
      // If the user lands on the root "/" of the dashboard,
      // redirect them to the first existing chat or create a new one.
      if (location.pathname === "/") {
        if (fetchedChats && fetchedChats.length > 0) {
          navigate(`/${fetchedChats[0].chatId}`, { replace: true });
        } else {
          // Create a new chat immediately if none exist
          const newChatId = uuidv4();
          navigate(`/${newChatId}`, { replace: true });
        }
      }
    };
    
    initializeDashboard();
  }, []); // Runs only once when the dashboard is first mounted

  return (
    <div className={`flex flex-1 h-[100vh] dark:bg-PrimaryBlack bg-white`}>
      <MainSideBar setContrast={setIsContrast} />
      
      {/* The Outlet will render the specific route component (Home, UploadDocument, etc.) */}
      <div className="flex w-full">
        <Outlet />
      </div>

      <NotebookWriter />
    </div>
  );
};

export default DashboardLayout;