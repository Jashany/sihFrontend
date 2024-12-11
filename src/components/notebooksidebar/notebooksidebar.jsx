import upload from "../../assets/svgs/upload.svg";
import UploadButton from "../uploadDocSidebar/blueButton";
import { useEffect, useState } from "react";
import {NotebookPen} from 'lucide-react';
import CaseNotes from "./notebooklist";
import { ChatListItem } from "../sidebar/chat-list-item";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
export function Sidebar({ activeNotebookId, notebooks, onNotebookSelect }) {

  const [notebookList, setNotebooks] = useState([]);
  const [activeIdMain, setActiveIdMain] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setActiveIdMain(id);
  }, [id]);

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
        setNotebooks([...notebooks, data.data]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  const notebookSelect = (id) => {
    navigate(`/notebook/${id}`);
  }

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
        setNotebooks(data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <div className="w-[350px] bg-PrimaryGrayDark h-screen flex flex-col">
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-gray-200 font-semibold">Your Notebooks</h1>
        </div>
      </div>

      <div className="p-2 space-x-2 flex bg-PrimaryBlue w-[90%] items-center mx-auto rounded-md gap-2 justify-center" onClick={createNotebook}>
        <p className="h-full flex items-center">
          Create Notebook 
        </p>
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
          ))
        }
 
      </div>

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
  );
}
