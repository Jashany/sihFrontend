
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Summary from "../summary/SummarySection";

const Casepdf = () => {
  const [caseData, setCaseData] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(""); // To store PDF file URL
  const [selectedSections, setSelectedSections] = useState([]); // Tracks selected sections
  const [text, setText] = useState("");
  const { source } = useParams();
  const [summary, setSummary] = useState(false);

  useEffect(()=>{
    const fetchText = async () => {
      const response = await axios.get(`https://pub-d58fae2843f34cfcbf2cfb0606b5efaf.r2.dev/judgmenttxts/${source}.txt`);
      const data = response.data;
      setText(data);
    }
    fetchText();
  },[summary])

  useEffect(() => {
    // Fetch the case data
    const fetchCaseData = async () => {
      const response = await fetch(`http://localhost:3000/api/cases/${source}`);
      const data = await response.json();
      setCaseData(data);
      console.log(data);
    };
    fetchCaseData();
  }, [source]);

  useEffect(() => {
    // Fetch the PDF file URL if `judgement_path` is available
    if (caseData?.data?.judgement_path) {
      const pdfPath = caseData.data.PDF_Path; // Assuming this field contains the PDF file path
      console.log(pdfPath);
      const pdfUrl = `https://pub-d58fae2843f34cfcbf2cfb0606b5efaf.r2.dev/${pdfPath}`; // Construct the URL for the R2 bucket PDF
      setPdfUrl(pdfUrl);
    }
  }, [caseData]);

  // Toggle selection for a section
  const handleCheckboxChange = (section) => {
    setSelectedSections((prev) =>
      prev.includes(section)
        ? prev.filter((item) => item !== section)
        : [...prev, section]
    );
  };

  // Function to render selected content with headings
  const renderSelectedContent = () => {
    if (selectedSections.length === 0) {
      return null; // Do not render anything if no checkbox is selected
    }

    let hasContent = false;
    const contentSections = selectedSections.map((section) => {
      let content;
      if (section === "Issues") {
        content = caseData?.data?.Issues?.map((issue, index) => (
          <p key={index}>{issue}</p>
        ));
      } else if (section === "Facts") {
        content = caseData?.data?.Facts?.map((fact, index) => (
          <p key={index}>{fact}</p>
        ));
      } else if (section === "Conclusions") {
        content = caseData?.data?.Conclusions?.map((conclusion, index) => (
          <p key={index}>{conclusion}</p>
        ));
      }

      if (content && content.length > 0) {
        hasContent = true;
        return (
          <div
            className="dark:bg-PrimaryGrayLight bg-TertiaryWhite dark:text-white text-black p-4 rounded-md mb-4"
            key={section}
            style={{ marginTop: "20px" }}
          >
            <h3 className="dark:text-white text-black font-semibold text-xl">
              {section}
            </h3>
            {content}
          </div>
        );
      }
      return null;
    });

    return (
      <>
        {contentSections}
        {!hasContent &&
          selectedSections.length !=
            0(
              <p style={{ color: "white", marginTop: "20px" }}>
                No content available for the selected sections.
              </p>
            )}
      </>
    );
  };

  const isCitations = caseData?.data?.Citations !== "Not Found";
  const isBenchFound = caseData?.data?.Bench !== "Not Found";
  const isAuthorFound = caseData?.data?.Judgment_Author !== "Not Found";

  return (
    <div
      className="flex-1 flex flex-col max-h-[100vh] overflow-scroll  dark:bg-PrimaryBlack bg-PrimaryWhite items-center py-8"
      style={{
        scrollbarWidth: "none",
      }}
    >
      <h2 className="dark:text-white text-black">
        {caseData?.data?.Court_Name || "Loading..."}
      </h2>
      <h1 className="dark:text-white text-black my-4 text-2xl font-bold">
        {caseData?.data?.Case_Title || "Loading..."}
      </h1>
      <h3 className="dark:text-[#787878] text-PrimaryGrayDark">
        Author: {isAuthorFound ? caseData?.data?.Judgment_Author : "Not Found"}
      </h3>
      <h4 className="dark:text-[#787878] text-PrimaryGrayLight">
        Bench: {isBenchFound ? caseData?.data?.Bench : "Not Found"}
      </h4>
      {isCitations && (
        <h4 className="dark:text-[#787878] text-PrimaryGrayDark">
          Citations: {caseData?.data?.Citations || "Loading..."}
        </h4>
      )}

      <div
        className="inputCheckbox"
        style={{ margin: "20px 0", color: "white" }}
      >
        {caseData?.data?.Issues.length > 0 && (
          <label>
            <input
              type="checkbox"
              checked={selectedSections.includes("Issues")}
              onChange={() => handleCheckboxChange("Issues")}
            />
            Issues
          </label>
        )}
        {caseData?.data?.Facts.length > 0 && (
          <label style={{ marginLeft: "10px" }}>
            <input
              type="checkbox"
              checked={selectedSections.includes("Facts")}
              onChange={() => handleCheckboxChange("Facts")}
            />
            Facts
          </label>
        )}
        {caseData?.data?.Conclusions.length > 0 && (
          <label style={{ marginLeft: "10px" }}>
            <input
              type="checkbox"
              checked={selectedSections.includes("Conclusions")}
              onChange={() => handleCheckboxChange("Conclusions")}
            />
            Conclusions
          </label>
        )}
      </div>

        

      <button className={`bg-PrimaryBlue text-white px-12 hover:bg-blue-700 py-3 rounded-lg ${summary ? "hidden" : ""}`}
        onClick={() => setSummary(true)}
      
      >Generate Summary</button>
      <div style={{ marginTop: "20px", width: "80%" }}>
        {renderSelectedContent()}
      </div>

      {
          summary && text && (
            <Summary text={text} />
          )
        }
      <div
        style={{
          height: "80vh",
          width: "60vw",
          margin: "auto",
          marginBottom: "100px",
        }}
      >
        <iframe
          src={pdfUrl}
          style={{ width: "100%", minHeight: "100vh" }}
          frameBorder="0"
        ></iframe>
      </div>
    </div>
  );
};

export default Casepdf;
