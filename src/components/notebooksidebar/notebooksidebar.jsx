import upload from "../../assets/svgs/upload.svg";
import UploadButton from "../uploadDocSidebar/blueButton";

export function Sidebar({ activeNotebookId, notebooks, onNotebookSelect }) {
  return (
    <div className="w-96 bg-PrimaryGrayDark h-screen flex flex-col">
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-gray-200 font-semibold">Your Notebooks</h1>
        </div>
      </div>

      <div className="p-4">
        <UploadButton name="Upload Document" svg={upload} />
      </div>

      <div className="flex-1 overflow-y-auto pl-5 pt-3">
        {notebooks &&
          notebooks.length > 0 &&
          notebooks.map((doc) => (
            <DocumentListItem
              key={doc.id}
              title={doc.title}
              isActive={doc.id === activeNotebookId}
              onClick={() => onNotebookSelect(doc.id)}
            />
          ))}
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
