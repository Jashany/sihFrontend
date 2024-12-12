import { useNavigate } from "react-router-dom";
import upload from "../../assets/svgs/upload.svg";
import UploadButton from "./blueButton";
import DocumentListItem from "./upload-doc-list-item";

export function Sidebar({ activeDocId, docs, onDocSelect, handlePdfText }) {
  const navigate = useNavigate();

  return (
    <div className="w-[400px] dark:bg-PrimaryGrayDark bg-TertiaryWhite min-h-screen ">
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <h1 className="dark:text-gray-200 text-DarkBlue font-semibold">Your Documents</h1>
        </div>
      </div>

      <div className="p-4">
        <UploadButton
          name="Upload Document"
          svg={upload}
          handleText={handlePdfText}
        />
      </div>

      <div className="flex-1 overflow-y-auto pl-5 pt-3">
        {docs &&
          docs.length > 0 &&
          docs.map((doc) => (
            <DocumentListItem
              key={doc.documentId}
              title={doc.summary}
              isActive={doc.documentId === activeDocId}
              onClick={() => {
                navigate(`/upload/${doc.documentId}`);
                onDocSelect(doc.documentId);
              }}
            />
          ))}
      </div>

     
    </div>
  );
}
