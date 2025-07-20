import { useEffect, useState } from "react";
import { NotebookPen, Search } from "lucide-react";
import { SearchBar } from "../sidebar/search-bar";
import { ChatListItem } from "../sidebar/chat-list-item";
import { useNavigate, useParams } from "react-router-dom";

export function Sidebar({ activeNotebookId, notebooks, onNotebookSelect, onSearch }) {
  const [notebookList, setNotebookList] = useState([]);
  const [activeIdMain, setActiveIdMain] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setActiveIdMain(id);
  }, [id]);

  const notebookSelect = (id) => {
    navigate(`/notebook/${id}`);
  };

  useEffect(() => {
    fetch("http://localhost:3000/api/notebook/get-chats", {
      credentials: "include",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.data);
        setNotebookList(data.data);
        if (data.data.length > 0 && !id) navigate(data.data[0].notebookId);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const createNotebook = () => {
    fetch("http://localhost:3000/api/notebook/create-notebook", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setNotebookList((prevList) => [...prevList, data.data]);
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleSearch = (searchTerm) => {
    
    if (!searchTerm) {
      setNotebookList(notebooks); // Reset list when no search term
      return;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    console.log("Searching:", lowercasedTerm);
    const filtered = notebookList?.filter((notebook) =>{
      console.log(notebook)
      notebook.title.toLowerCase().includes(lowercasedTerm)
    }
    );
    setNotebookList(filtered);
  };
  
  
  

  return (
    <div className="w-[400px] dark:bg-PrimaryGrayDark bg-TertiaryWhite h-screen flex flex-col">
      <div className="p-4">
        <h1 className="dark:text-gray-200 text-DarkBlue font-semibold">Your Notebooks</h1>
      </div>
      <div
        className="p-2 space-x-2 dark:text-white flex bg-PrimaryBlue w-[90%] items-center mx-auto rounded-md gap-2 justify-center"
        onClick={createNotebook}
      >
        <p>Create Notebook</p>
        <NotebookPen color="white" size={18} />
      </div>

   
      <div className="mt-5 flex-1 flex flex-col  gap-4 overflow-y-auto pl-5 pt-3">
        {notebookList &&
          notebookList?.length > 0 &&
          notebookList?.map((doc) => (
            <ChatListItem
              key={doc?.notebookId}
              title={doc?.title}
              isActive={activeIdMain}
              onClick={() => notebookSelect(doc?.notebookId)} // Corrected
            />
          ))}
      </div>
    </div>
  );
}
