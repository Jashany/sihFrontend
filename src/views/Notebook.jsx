import {  useState } from "react";
import { Sidebar } from "../components/notebooksidebar/notebooksidebar";
import { useNavigate } from "react-router-dom";


const NotebookPage = () => {
  const [activeNotebook, setActiveNotebookId] = useState("1");
  const [notebooks, setNotebooks] = useState("");
  const navigate = useNavigate();
  // const activeNotebookId = notebooks.find(notebook => notebook.id === activeNotebook);
    
  const onNotebookSelect = (id) => {
    setActiveNotebookId(id);
    navigate(`/notebook/${id}`);
  }

  return (
    <div className="flex bg-PrimaryBlack text-gray-200 h-screen">
      <Sidebar activeNotebookId={1} onNotebookSelect={onNotebookSelect} notebooks={notebooks} /> 
        
    </div>
  );
};


export default NotebookPage;