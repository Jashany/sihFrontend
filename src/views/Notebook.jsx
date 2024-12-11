import {  useState } from "react";
import { Sidebar } from "../components/notebooksidebar/notebooksidebar";


const NotebookPage = () => {
  const [activeNotebook, setActiveNotebookId] = useState("1");
  const [notebooks, setNotebooks] = useState("");

  const activeNotebookId = notebooks.find(notebook => notebook.id === activeNotebook);
    
  const onNotebookSelect = (id) => {
    setActiveNotebookId(id);
  }

  return (
    <div className="flex bg-PrimaryBlack text-gray-200 h-screen">
      <Sidebar activeNotebookId={1} onNotebookSelect={onNotebookSelect} notebooks={notebooks} /> 
        
    </div>
  );
};


export default NotebookPage;