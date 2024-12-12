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

  const SetActiveNotebooks = (notebook) => {
    setNotebooks(notebook);
  }

  return (
    <div className="flex dark:bg-PrimaryBlack bg-PrimaryWhite dark:text-gray-200 text-black h-screen">
      <Sidebar activeNotebookId={setActiveNotebookId} onNotebookSelect={onNotebookSelect} notebooks={notebooks} /> 
        
    </div>
  );
};


export default NotebookPage;