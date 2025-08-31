import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { translateToLanguage } from "../../services/LanguageEnglish"; // Assuming you have this service
// import Summary from "../summary/SummarySection"; // Summary component is not used in the provided code

const Casepdf = () => {
  const [caseData, setCaseData] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [selectedSections, setSelectedSections] = useState([]);
  const [translatedContent, setTranslatedContent] = useState({});
  const [text, setText] = useState("");
  const { source } = useParams();
  const [summary, setSummary] = useState(false);

  useEffect(() => {
    const fetchText = async () => {
      try {
        const response = await axios.get(`https://pub-d58fae2843f34cfcbf2cfb0606b5efaf.r2.dev/judgmenttxts/${source}.txt`);
        setText(response.data);
      } catch (error) {
        console.error("Failed to fetch text content:", error);
      }
    };
    if (source) fetchText();
  }, [summary, source]);

  useEffect(() => {
    const fetchCaseData = async () => {
      try {
        const response = await fetch(`https://lawapi.jsondev.in/api/cases/${source}`);
        const data = await response.json();
        setCaseData(data);
      } catch (error) {
        console.error("Failed to fetch case data:", error);
      }
    };
    if (source) fetchCaseData();
  }, [source]);

  useEffect(() => {
    if (caseData?.data?.PDF_Path) {
      const pdfPath = caseData.data.PDF_Path;
      const url = `https://pub-d58fae2843f34cfcbf2cfb0606b5efaf.r2.dev/${pdfPath}`;
      setPdfUrl(url);
    }
  }, [caseData]);

  const handleTranslation = async (textToTranslate, lang) => {
    if (!textToTranslate) return "";
    try {
      const translatedText = await translateToLanguage(textToTranslate, lang);
      return translatedText;
    } catch (error) {
      console.error("Error translating content:", error);
      return textToTranslate; // Fallback to original text
    }
  };

  useEffect(() => {
    const translateCaseData = async () => {
      const targetLang = localStorage.getItem("targetLanguage") || "hi";
      if (!caseData?.data) return;

      const translatedData = {
        CourtName: await handleTranslation(caseData.data.Court_Name, targetLang),
        CaseTitle: await handleTranslation(caseData.data.Case_Title, targetLang),
        Author: await handleTranslation(caseData.data.Judgment_Author, targetLang),
        Bench: await handleTranslation(caseData.data.Bench, targetLang),
        Citations: await handleTranslation(caseData.data.Citations, targetLang),
      };
      setTranslatedContent(translatedData);
    };

    translateCaseData();
  }, [caseData]);

  const handleCheckboxChange = (section) => {
    setSelectedSections((prev) =>
      prev.includes(section)
        ? prev.filter((item) => item !== section)
        : [...prev, section]
    );
  };

  const renderSelectedContent = () => {
    if (selectedSections.length === 0) return null;

    const sections = {
      Issues: caseData?.data?.Issues,
      Facts: caseData?.data?.Facts,
      Conclusions: caseData?.data?.Conclusions,
    };

    const contentSections = selectedSections.map((section) => {
      const content = sections[section];
      if (!content || content.length === 0) return null;

      return (
        <div
          className="dark:bg-PrimaryGrayLight bg-TertiaryWhite dark:text-white text-black p-4 rounded-md mb-4 mt-5"
          key={section}
        >
          <h3 className="dark:text-white text-black font-semibold text-xl mb-2">
            {section}
          </h3>
          {content.map((item, index) => (
            <p key={index} className="mb-1">{item || `No ${section.slice(0, -1)} provided`}</p>
          ))}
        </div>
      );
    }).filter(Boolean); // Remove null entries

    if (contentSections.length === 0) {
      return <p className="dark:text-white text-black mt-5">No content available for the selected sections.</p>;
    }
    
    return contentSections;
  };

  const isCitations = caseData?.data?.Citations && caseData.data.Citations !== "Not Found";
  const isBenchFound = caseData?.data?.Bench && caseData.data.Bench !== "Not Found";
  const isAuthorFound = caseData?.data?.Judgment_Author && caseData.data.Judgment_Author !== "Not Found";

  return (
    <div className="flex-1 flex flex-col max-h-screen overflow-y-auto dark:bg-PrimaryBlack bg-PrimaryWhite items-center p-4 sm:p-8" style={{ scrollbarWidth: "none" }}>
      
      <h2 className="dark:text-gray-300 text-gray-600 text-center mt-[70px] lg:mt-0">
        {translatedContent?.CourtName || "Loading..."}
      </h2>
      <h1 className="dark:text-white text-black my-4 text-xl sm:text-2xl font-bold text-center">
        {translatedContent?.CaseTitle || "Loading..."}
      </h1>
      <h3 className="dark:text-[#787878] text-PrimaryGrayDark text-center">
        Author: {isAuthorFound ? translatedContent?.Author : "Not Found"}
      </h3>
      <h4 className="dark:text-[#787878] text-PrimaryGrayDark text-center">
        Bench: {isBenchFound ? translatedContent?.Bench : "Not Found"}
      </h4>
      {isCitations && (
        <h4 className="dark:text-[#787878] text-PrimaryGrayDark text-center">
          Citations: {translatedContent?.Citations || "Loading..."}
        </h4>
      )}

      {/* Responsive Checkbox Section */}
      <div className="my-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 dark:text-white text-black">
        {caseData?.data?.Issues?.length > 0 && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={selectedSections.includes("Issues")}
              onChange={() => handleCheckboxChange("Issues")}
            />
            Issues
          </label>
        )}
        {caseData?.data?.Facts?.length > 0 && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={selectedSections.includes("Facts")}
              onChange={() => handleCheckboxChange("Facts")}
            />
            Facts
          </label>
        )}
        {caseData?.data?.Conclusions?.length > 0 && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={selectedSections.includes("Conclusions")}
              onChange={() => handleCheckboxChange("Conclusions")}
            />
            Conclusions
          </label>
        )}
      </div>

      {/* <button
        className={`bg-PrimaryBlue text-white px-12 hover:bg-blue-700 py-3 rounded-lg transition-all ${summary ? "hidden" : "block"}`}
        onClick={() => setSummary(true)}
      >
        Generate Summary
      </button> */}

      {/* Responsive Content & PDF Sections */}
      <div className="w-full md:w-5/6 lg:w-3/4 mt-5">
        {renderSelectedContent()}
      </div>

      <div className="w-full md:w-5/6 lg:w-3/4 h-screen my-12 mx-auto">
        <iframe
          src={pdfUrl}
          className="w-full lg:h-[100vh] h-[70vh] md:h-[80vh]  border-none rounded-lg shadow-lg"
          title={`${source} PDF Document`}
        ></iframe>
      </div>
    </div>
  );
};

export default Casepdf;