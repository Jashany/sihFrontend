import { useEffect, useState } from "react";
import { Sidebar } from "../components/uploadDocSidebar/sidebar";
import SummarySection from "../components/uploadDocSidebar/summary-section";
import Loader from "../components/uploadDocSidebar/loader";
import { v4 as uuidv4 } from "uuid";
import AuthAxios from "../utils/authaxios";
import { useNavigate, useParams } from "react-router-dom";
import chatTriangler from "../assets/svgs/chat-triangle.svg";
import axios from "axios";
import TextToSpeech from "../utils/TextToSpeech";

const UploadDocument = () => {
  const { id } = useParams();
  const [activeDocId, setActiveDocId] = useState(id);
  const [docs, setDocs] = useState([]); // Start with an empty document list
  const [loading, setLoading] = useState(false);
  const [loadingStageTime, setLoadingStageTime] = useState(1000); // Default time for the last stage
  const [summary, setSummary] = useState("");
  const [judgement, setjudgement] = useState("");
  const [paths, setPaths] = useState([]);
  const [activeDoc, setActiveDoc] = useState(null);
  const [lsi, setLsi] = useState(null);
  const [loadingLsi, setLoadingLsi] = useState(false);
  const [loadingJudgement, setLoadingJudgement] = useState(false);

  const navigate = useNavigate();

  const formatStatutes = (statutes) => {
    return Object.entries(statutes).map(([key, value]) => ({
      title: key.replace(/^\*\s*/, ''), // Remove leading asterisks for cleaner titles
      description: value,
    }));
  };

  const newDoc = {
    id: uuidv4(),
    title:  "Untitled Document",
  };

  const CallSummarizeApi = async (text) => {
    try {
      setLoading(true);
      console.log(text);
  
      const startTime = Date.now(); // Record the start time
      const response = await fetch("http://127.0.0.1:8000/api/summarize/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input_text: text,
        }),
      });
  
      const data = await response.json();
      const duration = Date.now() - startTime;
  
      // Add 1 second to the API duration for smoother transition
      setLoadingStageTime(duration + 1000);
  
      const generatedSummary = data?.summary_text || "";
      setSummary(generatedSummary);
      setPaths(data?.paths || []);
      // Extract a few words from the summary for the title
      const titleSnippet =
        generatedSummary.split(" ").slice(0, 5).join(" ") + "...";
  
      // Add the new document to the list
      
      // setDocs((prevDocs) => [...prevDocs, newDoc]);
      // setActiveDocId(newDoc.id);
      
      // setLoadingJudgement(true);
      // const judgementRes = await axios.post(
      //   "http://127.0.0.1:8000/api/judgement/",
      //   {
      //     input_text: text,
      //   }
      // );
      // setLoadingJudgement(false);
      // const judgementdata = judgementRes.data?.result || "";
      // setjudgement(judgementdata);
      
  
      // Finally, save everything using the /api/doc/ API
      await AuthAxios.post("http://localhost:3000/api/doc/", {
        documentId: newDoc.id,
        title: newDoc.title,
        summary: generatedSummary,
        judgement: null,
        statutes: null,
        paths: data?.paths || [],
      })
        .then((response) => {
          const backendResponse = response.data; // Access the response data
          if (backendResponse.success) {
            console.log("Summary saved successfully");
          } else {
            console.error("Failed to save summary:", backendResponse.error);
          }
        })
        .catch((error) => {
          console.error(
            "Error while saving summary to backend:",
            error.message
          );
        });
  
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
    }
  };

  

  
  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await AuthAxios.get("/doc");
      const data = res.data;
      if (data.success) {
        setDocs(data.data);
        if (data.data.length > 0) {
          // Automatically set the first document as active
          const firstDoc = data.data[0];
          setActiveDocId(firstDoc.id);
          setSummary(firstDoc.summary || "");
          setPaths(firstDoc.paths || []);
        }
      } else {
        console.error("Failed to fetch documents");
      }
    } catch (err) {
      console.error("An error occurred while fetching documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs(); // Automatically fetches and sets the first document as active
  }, []);

  useEffect(() => {
    if (activeDocId) {
      const fetchActiveDoc = async () => {
        setLoading(true);
        try {
          const res = await AuthAxios.get(`/doc/${activeDocId}`);
          const data = res.data;
          if (data.success) {
            setSummary(data.data.summary || "");
            setPaths(data.data.paths || []);
          } else {
            console.error("Failed to fetch the active document");
          }
        } catch (err) {
          console.error("Error while fetching the active document:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchActiveDoc();
    }
  }, [activeDocId]);

  return (
    <div className=" dark:bg-PrimaryBlack dark:text-gray-200 bg-PrimaryWhite text-black min-h-screen w-full flex justify-center   ">
      <div className="min-h-screen">
        <Sidebar
          activeDocId={activeDocId}
          docs={docs}
          onDocSelect={(docId) => setActiveDocId(docId)} // Pass the selected document ID
          handlePdfText={(text) => {
            CallSummarizeApi(text);
          }}
        />
      </div>

      {loading && <Loader loadingStageTime={loadingStageTime} />}

      <div className="flex-1 gap-4  p-10 dark:bg-PrimaryBlack bg-PrimaryWhite max-h-[100vh] overflow-y-scroll">
        {!loading && summary && (
          <div className="">
            <h3 className="ml-5 mt-5 text-5xl font-extrabold ">Summary</h3>
            <p className="p-4 dark:bg-PrimaryGrayLight dark:text-white text-black bg-SecondaryWhite h-fit w-[80%] m-5 rounded-md">
              <div className="mb-5"><TextToSpeech text={summary} /></div>
              {summary}
            </p>
          </div>
        )}

        {!loadingJudgement && judgement && (
          <div className="">
            <h3 className="ml-5 mt-5 text-5xl font-extrabold ">Judgement</h3>
            <p className="p-4 dark:bg-PrimaryGrayLight dark:text-white text-black bg-SecondaryWhite h-fit w-[80%] m-5 rounded-md">
              {judgement}
            </p>
          </div>
        )}

        {/* {loadingJudgement && (
          <div>
            <p className="p-20 dark:bg-PrimaryGrayLight dark:text-PrimaryGrayLight text-white bg-SecondaryWhite h-fit w-[80%] m-5 rounded-md">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ducimus nisi, sunt sint, unde quisquam esse modi totam consequuntur neque animi aperiam harum accusantium ipsa dolor ad recusandae eveniet voluptates facilis?
            </p>
          </div>
        )} */}

        {!loadingLsi && lsi && (
          <div className="">

          {lsi &&  console.log(lsi)}
          </div>
        )}

        {paths && paths.length > 0 && (
          <div className="mt-4 pl-4">
            <h4 className="dark:text-gray-400 text-DarkBlue text-sm mb-2">
              Prior Relevant Cases
            </h4>
            <div className="space-y-2">
              {paths.map((path, index) => (
                <div
                  key={index}
                  className="dark:bg-PrimaryGrayLight bg-SecondaryWhite rounded-xl p-3 flex justify-between items-center"
                  onClick={() => stateChange(path)}
                >
                  <div>
                    <h5 className="text-gray-200">{path}</h5>
                    <p className="text-PrimaryGrayTextDark text-sm">{path}</p>
                  </div>
                  <button
                    onClick={() => {
                      const pathname = path.split(".")[0];
                      navigate(`/files/source/${pathname}`);
                    }}
                    className="px-5 py-2 text-sm dark:bg-PrimaryGrayLighter bg-TertiaryWhite dark:text-gray-200 text-black rounded-xl hover:bg-PrimaryGrayDark/30 transition-colors flex justify-center items-center space-x-1 gap-2 "
                  >
                    <img
                      src={chatTriangler}
                      alt="chat"
                      width={15}
                      height={10}
                    />
                    View Document
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadDocument;

const StatutesDisplay = ({ statutes }) => {
  return (
    <div className="p-4 bg-PrimaryGrayLight rounded-md w-4/5">
      <h3 className="text-2xl font-bold mb-4">Laws Applicable</h3>
      <div className="space-y-4">
        {statutes.map((statute, index) => (
          <div
            key={index}
            className="p-4 bg-white dark:bg-gray-700 shadow-md rounded-md"
          >
            <h4 className="text-lg font-semibold text-blue-600 mb-2">
              {statute.title}
            </h4>
            <p className="text-gray-700 dark:text-gray-300">
              {statute.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

