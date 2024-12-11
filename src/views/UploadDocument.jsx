import { useState } from "react";
import { Sidebar } from "../components/uploadDocSidebar/sidebar";
import SummarySection from "../components/uploadDocSidebar/summary-section";
import Loader from "../components/uploadDocSidebar/loader";

const initialDocs = [
  {
    id: 1,
    title: "Vodafone vs State.pdf",
    summary:
      "The Supreme Court concluded that the offshore transaction between HTIL and Vodafone was a legitimate FDI investment and fell outside India's territorial tax jurisdiction. The court set aside the Bombay High Court's judgment, which had upheld the Revenue's claim for capital gains tax. The court directed the Revenue to return the sum deposited by Vodafone with interest and to return the bank guarantee provided by Vodafone. The judgment underscores the importance of certainty and stability in tax policy for attracting foreign investment and emphasizes that legal doctrines like look through and limitation of benefits are matters of policy that require explicit legislative provision (Paragraphs 90-92, 279-280).",
    prediction:
      "The court prediction is most likely to be in favor of Vodafone.",
    statures: [
      {
        id: 1,
        section:
          "Section 138. Dishonour of cheque for insufficiency, etc., of funds in the account.",
      },
    ],
    sources: [
      {
        title: "State of Gujarat vs Kumar Bharti",
        subtitle: "Gujarat High Court - 2020 - 67 Citations",
        onView: () => console.log("Viewing document..."),
      },
    ],
  },
  {
    id: 2,
    title: "Armaan vs Utkarsh.pdf",
    summary:
      "The Supreme Court concluded that the offshore transaction between HTIL and Vodafone was a legitimate FDI investment and fell outside India's territorial tax jurisdiction. The court set aside the Bombay High Court's judgment, which had upheld the Revenue's claim for capital gains tax. The court directed the Revenue to return the sum deposited by Vodafone with interest and to return the bank guarantee provided by Vodafone. The judgment underscores the importance of certainty and stability in tax policy for attracting foreign investment and emphasizes that legal doctrines like look through and limitation of benefits are matters of policy that require explicit legislative provision (Paragraphs 90-92, 279-280).",
    prediction:
      "The court prediction is most likely to be in favor of Vodafone.",
    statures: [
      {
        id: 1,
        section:
          "Section 138. Dishonour of cheque for insufficiency, etc., of funds in the account.",
      },
    ],
    sources: [
      {
        title: "State vs Vodafone",
        subtitle: "Gujarat High Court - 2020 - 67 Citations",
        onView: () => console.log("Viewing document..."),
      },
    ],
  },
  {
    id: 3,
    title: "Utkrash vs Armeen.pdf",
    summary:
      "The Supreme Court concluded that the offshore transaction between HTIL and Vodafone was a legitimate FDI investment and fell outside India's territorial tax jurisdiction. The court set aside the Bombay High Court's judgment, which had upheld the Revenue's claim for capital gains tax. The court directed the Revenue to return the sum deposited by Vodafone with interest and to return the bank guarantee provided by Vodafone. The judgment underscores the importance of certainty and stability in tax policy for attracting foreign investment and emphasizes that legal doctrines like look through and limitation of benefits are matters of policy that require explicit legislative provision (Paragraphs 90-92, 279-280).",
    prediction:
      "The court prediction is most likely to be in favor of Vodafone.",
    statures: [
      {
        id: 1,
        section:
          "Section 138. Dishonour of cheque for insufficiency, etc., of funds in the account.",
      },
    ],
    sources: [
      {
        title: "State of Gujarat vs Kumar Bharti",
        subtitle: "Gujarat High Court - 2020 - 67 Citations",
        onView: () => console.log("Viewing document..."),
      },
    ],
  },
];

const UploadDocument = () => {
  const [activeDocId, setActiveDocId] = useState(1);
  const [docs, setDocs] = useState(initialDocs);
  const [loading, setLoading] = useState(false);
  const [loadingStageTime, setLoadingStageTime] = useState(1000); // Default time for the last stage
  const [summary, setSummary] = useState("");

  const activeDoc = docs.find((doc) => doc.id === activeDocId);

  const CallSummarizeApi = async (text) => {
    setLoading(true);

    const startTime = Date.now(); // Record the start time
    fetch("http://127.0.0.1:8000/api/summarize/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input_text: text,
      }),
    })
      .then((response) => {
        return response.json().then((data) => ({
          data,
          duration: Date.now() - startTime, // Calculate duration
        }));
      })
      .then(({ data, duration }) => {
        setLoading(false);

        // Add 1 second to the API duration for smoother transition
        setLoadingStageTime(duration + 1000);
        setSummary(data?.summary_text);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error:", error);
      });
  };

  return (
    <div className="flex bg-PrimaryBlack text-gray-200 h-screen w-full">
      <Sidebar
        activeDocId={activeDocId}
        docs={docs}
        onDocSelect={setActiveDocId}
        handlePdfText={CallSummarizeApi}
      />
      {loading && 
        <Loader loadingStageTime={loadingStageTime} />
      }
      {
        !loading && summary && 
        <div>
          <h3 className="ml-5 mt-5 text-2xl">
            Summary
          </h3>
        <p className="p-2 bg-PrimaryGrayLight text-white h-fit w-[80%] m-5 rounded-md">
          {summary}
        </p>
        </div>
      }
    </div>
  );
};

export default UploadDocument;
