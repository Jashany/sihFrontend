import { useEffect, useState } from "react";
// Import Menu and X icons for the hamburger button
import { NotebookPen, Menu, X,MessageSquare } from "lucide-react";
import { ChatListItem } from "../sidebar/chat-list-item";
import { useNavigate, useParams } from "react-router-dom";

export function Sidebar({ activeNotebookId, notebooks, onNotebookSelect, onSearch }) {
  const [notebookList, setNotebookList] = useState([]);
  const [activeIdMain, setActiveIdMain] = useState(null);
  // State to control sidebar visibility on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setActiveIdMain(id);
    // Close sidebar on mobile when a new chat is selected
    if (window.innerWidth < 768) { // md breakpoint in Tailwind
      setIsSidebarOpen(false);
    }
  }, [id]);

  const notebookSelect = (id) => {
    navigate(`/chat/notebook/${id}`);
  };

  useEffect(() => {
    fetch("https://lawapi.jsondev.in/api/notebook/get-chats", {
      credentials: "include",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setNotebookList(data.data);
        if (data.data.length > 0 && !id) navigate(`/chat/notebook/${data.data[0].notebookId}`);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const createNotebook = () => {
    fetch("https://lawapi.jsondev.in/api/notebook/create-notebook", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setNotebookList((prevList) => [...prevList, data.data]);
        // Navigate to the new notebook and close the sidebar on mobile
        navigate(`/chat/notebook/${data.data.notebookId}`);
      })
      .catch((error) => console.error("Error:", error));
  };
  
  // The search function was incomplete, so I've added a return statement.
  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      // You might want to fetch the original list again or have it stored in another state
      // For now, this line assumes `notebooks` prop holds the original full list.
      setNotebookList(notebooks);
      return;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    const filtered = notebookList?.filter((notebook) =>
      notebook.title.toLowerCase().includes(lowercasedTerm)
    );
    setNotebookList(filtered);
  };
  
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

      {/* SIDEBAR */}
      <div
        className={`
          dark:bg-PrimaryGrayDark bg-TertiaryWhite h-screen flex flex-col z-50
          transition-transform duration-300 ease-in-out
          
          fixed w-4/5 max-w-sm top-0 left-0 md:relative md:w-[400px] md:translate-x-0
          md:border-r md:dark:border-gray-700 md:border-gray-200
          
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-4 flex justify-between items-center">
          <h1 className="dark:text-gray-200 text-DarkBlue font-semibold">Your Notebooks</h1>
          {/* CLOSE BUTTON - visible only on mobile */}
          <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
            <X className="h-6 w-6 dark:text-gray-200 text-DarkBlue" />
          </button>
        </div>

        <div
          className="p-2 space-x-2 dark:text-white flex bg-PrimaryBlue w-[90%] items-center mx-auto rounded-md gap-2 justify-center cursor-pointer"
          onClick={createNotebook}
        >
          <p>Create Notebook</p>
          <NotebookPen color="white" size={18} />
        </div>
        
        <div className="mt-5 flex-1 flex flex-col gap-4 overflow-y-auto pl-5 pt-3">
          {notebookList &&
            notebookList?.length > 0 &&
            notebookList?.map((doc) => (
              <ChatListItem
                key={doc?.notebookId}
                title={doc?.title}
                isActive={activeIdMain === doc?.notebookId} // Corrected comparison
                onClick={() => notebookSelect(doc?.notebookId)}
              />
            ))}
        </div>
      </div>
    </>
  );
}