import { useState, useRef, useEffect } from "react";
// --- CHANGE 1: Import the X icon ---
import { Pencil, X } from "lucide-react";
import { useLocation } from "react-router-dom";

const NotebookWriter = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [notebooks, setNotebooks] = useState([]);
  const [selectedNotebook, setSelectedNotebook] = useState(null);
  const [segments, setSegments] = useState([]);
  const [editingSegment, setEditingSegment] = useState(null);
  const [newSegmentContent, setNewSegmentContent] = useState("");
  const [isAddingSegment, setIsAddingSegment] = useState(false);

  const writerRef = useRef(null);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (writerRef.current && !writerRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    fetch("http://localhost:3000/api/notebook/get-chats", {
      credentials: "include",
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => setNotebooks(data.data))
      .catch((error) => console.error("Error:", error));
  }, []);

  const handleNotebookSelect = (notebookId) => {
    setSelectedNotebook(notebookId);
    fetch(`http://localhost:3000/api/notebook/${notebookId}`, {
      credentials: "include",
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => setSegments(data.data.segments))
      .catch((error) => console.error("Error:", error));
  };

  const handleAddProject = () => {
    const newNotebookTitle = prompt("Enter a title for the new project:");
    if (newNotebookTitle) {
      fetch("http://localhost:3000/api/notebook/create-notebook", {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newNotebookTitle }),
      })
        .then((response) => response.json())
        .then((data) => setNotebooks([...notebooks, data.data]))
        .catch((error) => console.error("Error:", error));
    }
  };

  const handleEditSegment = (segmentId) => {
    const segment = segments.find((seg) => seg.segmentId === segmentId);
    setEditingSegment(segmentId);
    setNewSegmentContent(segment?.notes || "");
  };

  const saveEditedSegment = () => {
    fetch(
      `http://localhost:3000/api/notebook/${selectedNotebook}/update-segment/${editingSegment}`,
      {
        credentials: "include",
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: newSegmentContent }),
      }
    )
      .then(() => {
        setSegments(
          segments.map((segment) =>
            segment.segmentId === editingSegment
              ? { ...segment, notes: newSegmentContent }
              : segment
          )
        );
        setEditingSegment(null);
        setNewSegmentContent("");
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleAddSegment = () => {
    setIsAddingSegment(true);
    setNewSegmentContent("");
  };

  const isChatPath = /^\/chat\/[^/]+$/.test(location.pathname) && location.pathname !== "/chat/upload";
  const matchedPathname = isChatPath ? location.pathname : null;

  const saveNewSegment = () => {
    fetch(
      `http://localhost:3000/api/notebook/${selectedNotebook}/add-segment`,
      {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes: newSegmentContent,
          link: matchedPathname,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setSegments(data.data.segments);
        setIsAddingSegment(false);
        setNewSegmentContent("");
      })
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={toggleDrawer}
        className="fixed top-4 right-4 z-10 px-4 py-2 rounded dark:text-PrimaryLight text-PrimaryBlack flex gap-3 items-center bg-white/80 dark:bg-black/80 backdrop-blur-sm shadow-lg"
      >
        Add Notes
        <Pencil size={18} color="gray" />
      </button>
      
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-9"
          onClick={toggleDrawer}
          aria-hidden="true"
        />
      )}

      <div
        ref={writerRef}
        className={`
          fixed top-0 right-0 h-screen overflow-y-auto p-4
          dark:bg-PrimaryGrayLighter bg-TertiaryWhite shadow-2xl z-50
          transform transition-transform duration-300 ease-in-out
          w-full sm:w-[400px] 
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* --- CHANGE 2: Added a header with the title and a close button --- */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl dark:text-PrimaryLight text-PrimaryBlack font-semibold">
            Notebook Writer
          </h2>
          <button
            onClick={toggleDrawer}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close notebook writer"
          >
            <X size={24} className="dark:text-PrimaryLight text-PrimaryBlack" />
          </button>
        </div>

        <button 
          onClick={handleAddProject}
          className="w-full p-2 mb-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          + Add New Project
        </button>

        <select
          className="w-full p-2 mb-4 dark:bg-PrimaryGrayLight bg-SecondaryWhite dark:text-PrimaryLight text-black rounded-md"
          onChange={(e) => handleNotebookSelect(e.target.value)}
          value={selectedNotebook || ""}
        >
          <option value="" disabled>
            Select a notebook
          </option>
          {notebooks.map((notebook) => (
            <option key={notebook?.notebookId} value={notebook?.notebookId}>
              {notebook?.title}
            </option>
          ))}
        </select>

        {segments.map((segment) => (
          <div
            key={segment.segmentId}
            className="dark:bg-PrimaryGrayDark bg-white p-4 mb-4 rounded shadow"
          >
            {editingSegment === segment.segmentId ? (
              <>
                <textarea
                  value={newSegmentContent}
                  onChange={(e) => setNewSegmentContent(e.target.value)}
                  className="w-full p-3 text-sm dark:text-white text-black bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
                <div className="mt-2 flex justify-end gap-2">
                  <button
                    onClick={saveEditedSegment}
                    className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingSegment(null)}
                    className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm dark:text-PrimaryLight text-gray-800 whitespace-pre-line">
                  {segment?.notes}
                </p>
                <button
                  className="mt-2 text-sm font-medium text-blue-500 hover:underline"
                  onClick={() => handleEditSegment(segment?.segmentId)}
                >
                  Edit Segment
                </button>
              </>
            )}
          </div>
        ))}
        {selectedNotebook && !isAddingSegment && (
          <button
            className="w-full mt-2 p-2 text-sm font-medium text-blue-500 border border-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition-colors"
            onClick={handleAddSegment}
          >
            + Add Segment
          </button>
        )}

        {isAddingSegment && (
          <div className="mt-4 dark:bg-PrimaryGrayDark bg-white p-4 rounded shadow">
            <textarea
              value={newSegmentContent}
              onChange={(e) => setNewSegmentContent(e.target.value)}
              className="w-full p-3 text-sm dark:text-white text-black bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Enter notes for the new segment"
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                onClick={saveNewSegment}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                Save Segment
              </button>
              <button
                onClick={() => setIsAddingSegment(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NotebookWriter;