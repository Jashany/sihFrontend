import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Casepdf = () => {
  const [caseData, setCaseData] = useState(null);
  const [judgmentText, setJudgmentText] = useState(""); // To store fetched judgment text
  const [selected, setSelected] = useState(""); // Tracks which button is selected

  const { source } = useParams();

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
    // Fetch judgment text if `judgement_path` is available and selected is empty
    if (caseData?.data?.judgement_path) {
      console.log("hello");
      const fetchJudgmentText = async () => {
        const response = await fetch(
          `https://pub-d58fae2843f34cfcbf2cfb0606b5efaf.r2.dev/judgmenttxts/${source}.txt`
        );
        const text = await response.text();
        // const cleanedText = text.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim(); // Remove HTML tags and extra spaces
        setJudgmentText(text);
      };
      fetchJudgmentText();
    }
  }, [caseData]);

  // Function to render content based on the selected state
  const renderContent = () => {
    if (selected === "Issues") {
      return caseData?.Issues?.map((issue, index) => (
        <p key={index}>{issue}</p>
      ));
    } else if (selected === "Facts") {
      return caseData?.Facts?.map((fact, index) => <p key={index}>{fact}</p>);
    } else if (selected === "Conclusions") {
      return caseData?.Conclusions?.map((conclusion, index) => (
        <p key={index}>{conclusion}</p>
      ));
    } else {
      return (
        <div
        style={{
          whiteSpace: "pre-wrap",
          textAlign: "center", // Center the text
        }}
        dangerouslySetInnerHTML={{
          __html: judgmentText.replace(/\n/g, "<br />"), // Convert newlines to <br /> tags
        }}
      />
      );
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      <h2>{caseData?.data?.Court_Name || "Loading..."}</h2>
      <h1>{caseData?.data?.Case_Title || "Loading..."}</h1>
      <h3>Author: {caseData?.data?.Judgment_Author || "Loading..."}</h3>
      <h4>Bench: {caseData?.data?.Bench || "Loading..."}</h4>
      <h5>{caseData?.data?.Citations || "Loading..."}</h5>

      <div style={{ margin: "20px 0" }}>
        <button onClick={() => setSelected("Issues")}>Issues</button>
        <button onClick={() => setSelected("Facts")}>Facts</button>
        <button onClick={() => setSelected("Conclusions")}>Conclusions</button>
        <button onClick={() => setSelected("")}>Judgment</button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>Content:</h3>
        {renderContent()}
      </div>
    </div>
  );
};

export default Casepdf;
