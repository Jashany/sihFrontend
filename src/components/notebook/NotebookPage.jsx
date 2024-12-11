import { useEffect, useState, useCallback } from "react";
import { Sidebar } from "../notebooksidebar/notebooksidebar";
import { Link, useNavigate, useParams } from "react-router-dom";
import debounce from "lodash.debounce";

const NoteBookMain = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedText, setSavedText] = useState("");
  const [data, setData] = useState({});

  // Fetch notebook details
  useEffect(() => {
    const fetchNotebook = async () => {
      const res = await fetch(`http://localhost:3000/api/notebook/${id}`, {
        credentials: "include",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setData(data.data);
      setTitle(data.data.title);
    };

    fetchNotebook();
  }, [id]);

  const navigate = useNavigate();

  // Debounced save function
  const saveTitle = useCallback(
    debounce(async (newTitle) => {
      setIsSaving(true);
      try {
        await fetch(`http://localhost:3000/api/notebook/${id}/update-title`, {
          credentials: "include",
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: newTitle }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              setSavedText("Saved!");
              setTimeout(() => setSavedText(""), 2000);
            } else {
              setSavedText("Failed to save!");
            }
          });
      } catch (error) {
        console.error("Error saving title:", error);
      } finally {
        setIsSaving(false);
      }
    }, 500), // 500ms debounce
    [id]
  );

  // Handle title change
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    saveTitle(newTitle); // Trigger debounced save
  };

  return (
    <div className="flex w-full">
      <Sidebar />
      <div className="bg-PrimaryBlack w-full p-6">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="text-2xl font-bold bg-transparent text-gray-200 border-none outline-none w-full"
          placeholder="Enter notebook title..."
        />
        <div className="text-sm text-gray-400 mt-2">
          {isSaving ? "Saving..." : savedText}
        </div>
        <div>
        {data?.segments && data?.segments?.length > 0 ? (
            <div>
            {data?.segments?.map((segment) => (
              <div key={segment.id} className="bg-PrimaryGrayDark p-4">
                <pre className="text-lg text-gray-200 font-semibold">
                  {segment.notes}
                </pre>
                {segment.link && (
                   <p onClick={()=>{
                     navigate(segment.link);
                   }}>
                    View Analysis
                   </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-200">No Notes found</div>
        )}
      </div>
      </div>
   
    </div>
  );
};

export default NoteBookMain;
