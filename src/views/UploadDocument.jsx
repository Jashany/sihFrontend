import { useEffect, useState } from "react";
import { Sidebar } from "../components/uploadDocSidebar/sidebar";
import SummarySection from "../components/uploadDocSidebar/summary-section";
import Loader from "../components/uploadDocSidebar/loader";
import { v4 as uuidv4 } from "uuid";
import AuthAxios from "../utils/authaxios";
import { useNavigate, useParams } from "react-router-dom";
import chatTriangler from "../assets/svgs/chat-triangle.svg";
import axios from "axios";

const dummyJson = {
  summary_text:
    "The Honourable Judges, Gavai and K.V. Viswanathan, issued for consideration the question of whether the conviction for the offence punishable under Sections 302 of the Indian Penal Code (IPC) would fall or if it would be reduced to a lesser offence. The case involves the death of Bahal, the son of Rajni Bai, who was found to have died due to a homicidal death caused by internal haemorrhage and a fracture in the head leading to brain injury. The prosecution's story is that on December 20, 2002, Rajni Bai and Bahal arrived at Village Chhirha, where Bahal succumbed to his injuries after being assaulted by the accused persons. Digital evidence, including eyewitness accounts from several witnesses, including Rajni Bai, Dr. N.K. Yadu, Pusau, Ghurwaram, and others, supports the prosecution's version. The court, however, found that while the death was homicidal, the degree of culpability was not sufficiently high to warrant a conviction under Section 302 IPC. Therefore, the appeal was partly allowed, and the appellants were sentenced to the period already undergone.",
  paths: [
    "20463730.txt",
    "121832133.txt",
    "36010548.txt",
    "30645344.txt",
    "39235501.txt",
  ],
  case_outcome:
    "Based on the similar past cases provided, I predict the probable outcome of the input case as follows:\n\n**Probable Outcome:** The appellants will be convicted under a lesser offence, possibly Section 324 IPC (voluntarily causing hurt by dangerous weapons or means) or Section 307 IPC (attempt to murder), and sentenced to the period already undergone.\n\nReasoning: The court has found that the death was homicidal, but the degree of culpability is not high enough to warrant a conviction under Section 302 IPC (murder). This suggests that the accused may not have intended to kill Bahal, and a lesser offence may be more appropriate. The extracted outcomes from the similar past cases do not explicitly mention a conviction under Section 302 IPC in the same circumstances, which strengthens the likelihood of a conviction under a lesser offence.",
  legalStatute: {
    "Indian Penal Code (IPC)":
      "### Indian Penal Code (IPC)\n\nThe Indian Penal Code (IPC) is the primary criminal code of India, established in 1860 during the British colonial period. It serves as the comprehensive legal framework for defining various offenses and prescribing their respective punishments. The IPC is applicable across India, except in the state of Jammu and Kashmir, which has its own penal code. The code is divided into 23 chapters, comprising 511 sections, each detailing specific crimes and their legal consequences.\n\n#### Key Features:\n\n- **Offenses Against the State**: Includes crimes like waging war against the government, sedition, and other acts that threaten national security.\n- **Offenses Against Individuals**: Covers crimes such as murder, assault, kidnapping, and rape, providing detailed definitions and punishments for each.\n- **Offenses Against Property**: Encompasses theft, robbery, dacoity, and criminal trespass, among others.\n- **Public Tranquility**: Addresses unlawful assembly, rioting, and affray.\n\n#### Importance:\n\nThe IPC is crucial for maintaining law and order in the country, providing a legal basis for the prosecution of criminal activities. It ensures that justice is served by outlining clear legal standards and penalties, thereby deterring potential offenders. The code has undergone several amendments to address emerging crimes and societal changes, ensuring its relevance in contemporary legal practice.",
    "Section 304 (Punishment for culpable homicide not amounting to murder)":
      "### Section 304 IPC: Punishment for Culpable Homicide Not Amounting to Murder\n\nSection 304 of the Indian Penal Code deals with the punishment for culpable homicide not amounting to murder. This section is applicable when an individual causes the death of another person, but the act does not fulfill the criteria for murder as defined under Section 300 IPC.\n\n#### Structure:\n\n- **Part I**: This part applies when the act is done with the intention of causing death or with the intention of causing such bodily injury as is likely to cause death. The punishment under this part is imprisonment for life, or imprisonment for a term which may extend to ten years, and a fine.\n- **Part II**: This part applies when the act is done with the knowledge that it is likely to cause death, but without any intention to cause death or such bodily injury as is likely to cause death. The punishment under this part is imprisonment for a term which may extend to ten years, or with fine, or with both.\n\n#### Legal Implications:\n\nSection 304 is significant as it distinguishes between murder and culpable homicide not amounting to murder, providing a nuanced approach to sentencing based on the intent and knowledge of the accused. This distinction is crucial in ensuring that the punishment is proportionate to the severity of the crime and the mindset of the offender. The section allows for judicial discretion in sentencing, enabling courts to consider the specific circumstances of each case.",
    "Section 302 (Punishment for murder)":
      '### Section 302 IPC: Punishment for Murder\n\nSection 302 of the Indian Penal Code prescribes the punishment for the offense of murder. Murder, as defined under Section 300 IPC, involves the intentional causing of death or causing bodily injury that is likely to result in death.\n\n#### Punishment:\n\n- **Death Penalty**: The section allows for the imposition of the death penalty in cases deemed to be of the "rarest of rare" nature, where the crime is particularly heinous or brutal.\n- **Life Imprisonment**: Alternatively, the section provides for life imprisonment, which is the more commonly applied sentence.\n- **Fine**: In addition to imprisonment, the court may also impose a fine.\n\n#### Legal Context:\n\nSection 302 is one of the most severe provisions in the IPC, reflecting the gravity of the crime of murder. The section underscores the sanctity of human life and the state\'s commitment to protecting it. The provision for the death penalty, though controversial, is intended to serve as a deterrent against the most egregious forms of murder. However, the application of the death penalty is subject to strict judicial scrutiny, ensuring that it is reserved for cases where the crime is exceptionally grave.',
    "Section 307 (Attempt to murder)":
      "### Section 307 IPC: Attempt to Murder\n\nSection 307 of the Indian Penal Code deals with the offense of attempting to commit murder. This section is invoked when an individual, with the intention or knowledge of causing death, engages in an act that is likely to result in death.\n\n#### Punishment:\n\n- **Imprisonment**: The section prescribes imprisonment for a term which may extend to ten years, and the offender shall also be liable to fine.\n- **Life Imprisonment**: If the act causes hurt to any person, the offender may be punished with imprisonment for life.\n\n#### Legal Significance:\n\nSection 307 is crucial in addressing attempts to commit murder, recognizing the seriousness of the intent and the potential harm caused. The section ensures that individuals who engage in such acts are held accountable, even if the intended outcome (death) does not occur. The provision for life imprisonment reflects the gravity of the offense, particularly when the attempt results in injury. This section serves as a deterrent against violent crimes, emphasizing the importance of intent in criminal law.",
    "Section 34 (Acts done by several persons in furtherance of common intention)":
      "### Section 34 IPC: Acts Done by Several Persons in Furtherance of Common Intention\n\nSection 34 of the Indian Penal Code addresses situations where a criminal act is committed by several persons in furtherance of a common intention. This section is not a substantive offense but a rule of evidence, enabling the court to hold each participant equally liable for the act.\n\n#### Key Aspects:\n\n- **Common Intention**: The section requires that the act be done in furtherance of a common intention shared by all participants.\n- **Joint Liability**: All individuals involved are equally responsible for the criminal act, regardless of their individual roles.\n\n#### Legal Implications:\n\nSection 34 is significant in cases involving group crimes, ensuring that all participants are held accountable for the collective act. The section underscores the importance of intention in criminal law, emphasizing that shared intent can lead to joint liability. This provision is crucial in deterring group criminal activities, as it ensures that all members of a group are equally punished for their collective actions.",
    "Criminal Procedure Code (CrPC), 1973":
      "### Criminal Procedure Code (CrPC), 1973\n\nThe Criminal Procedure Code (CrPC) of 1973 is a comprehensive statute that outlines the procedural aspects of criminal law in India. It provides the framework for the administration of criminal justice, detailing the processes for investigation, trial, and punishment of offenses.\n\n#### Structure:\n\n- **Investigation**: The CrPC outlines the procedures for police investigations, including the powers of arrest, search, and seizure.\n- **Trial**: It details the various stages of a criminal trial, from the filing of charges to the delivery of judgment.\n- **Appeals and Revisions**: The code provides mechanisms for appealing and revising court decisions.\n- **Bail**: It includes provisions for granting bail, ensuring the rights of the accused are protected.\n\n#### Importance:\n\nThe CrPC is essential for ensuring the fair and efficient administration of criminal justice. It balances the powers of law enforcement with the rights of individuals, providing safeguards against arbitrary actions. The code is regularly updated to address new challenges and ensure its relevance in contemporary legal practice.",
    "Supreme Court Act, 1950":
      "### Supreme Court Act, 1950\n\nThe Supreme Court Act of 1950 is a pivotal piece of legislation that established the Supreme Court of India, the highest judicial authority in the country. The Act outlines the structure, powers, and jurisdiction of the Supreme Court, ensuring its role as the guardian of the Constitution and the final arbiter of legal disputes.\n\n#### Key Provisions:\n\n- **Establishment**: The Act formally established the Supreme Court, replacing the Federal Court of India.\n- **Jurisdiction**: It defines the original, appellate, and advisory jurisdiction of the Court.\n- **Powers**: The Act grants the Supreme Court the authority to interpret the Constitution, hear appeals, and issue writs.\n\n#### Significance:\n\nThe Supreme Court Act is fundamental to the Indian legal system, ensuring the independence and authority of the judiciary. It empowers the Supreme Court to uphold the rule of law and protect the rights of citizens. The Act is crucial for maintaining the balance of power between the different branches of government, ensuring that the judiciary can effectively check and balance the actions of the executive and legislative branches.",
    "Indian Evidence Act (IEA)":
      "### Indian Evidence Act (IEA)\n\nThe Indian Evidence Act, enacted in 1872, is a comprehensive statute that governs the rules of evidence in Indian courts. It provides the legal framework for determining the admissibility, relevance, and weight of evidence in both civil and criminal proceedings.\n\n#### Structure:\n\n- **Relevance of Facts**: The Act outlines what constitutes relevant facts and how they can be proved.\n- **Oral and Documentary Evidence**: It distinguishes between oral and documentary evidence, detailing the requirements for each.\n- **Burden of Proof**: The Act specifies who bears the burden of proof in various legal contexts.\n- **Presumptions**: It includes provisions for certain presumptions that can be made by the court.\n\n#### Importance:\n\nThe Indian Evidence Act is crucial for ensuring the integrity and fairness of the judicial process. It provides clear guidelines for the presentation and evaluation of evidence, ensuring that decisions are based on reliable and relevant information. The Act is regularly interpreted and applied by courts to address new challenges and ensure justice is served in an evolving legal landscape.",
  },
};

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
  const [data, setData] = useState(null);
  const [lsi, setLsi] = useState(null);
  const [loadingLsi, setLoadingLsi] = useState(false);
  const [loadingJudgement, setLoadingJudgement] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);

  const navigate = useNavigate();

  const formatStatutes = (statutes) => {
    return Object.entries(statutes).map(([key, value]) => ({
      title: key.replace(/^\*\s*/, ""), // Remove leading asterisks for cleaner titles
      description: value,
    }));
  };

  const newDoc = {
    id: uuidv4(),
    title: "Untitled Document",
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
      setData(data);
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

      setjudgement(data.case_outcome);
      setLsi(data.legalStatute);

      // Finally, save everything using the /api/doc/ API
      await AuthAxios.post("http://localhost:3000/api/doc/", {
        documentId: newDoc.id,
        title: newDoc.title,
        summary: generatedSummary,
        judgement: data.case_outcome,
        statutes: data.legalStatute,
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
        {!loading && dummyJson?.summary_text && (
          <div className="">
            <h3 className="ml-5 mt-5 text-5xl font-extrabold ">Summary</h3>
            <p className="p-4 dark:bg-PrimaryGrayLight dark:text-white text-black bg-SecondaryWhite h-fit w-[80%] m-5 rounded-md">
              {dummyJson?.summary_text}
            </p>
          </div>
        )}

        {!loadingJudgement && dummyJson?.case_outcome && (
          <div className="">
            <h3 className="ml-5 mt-5 text-5xl font-extrabold ">Judgement</h3>
            <p className="p-4 dark:bg-PrimaryGrayLight dark:text-white text-black bg-SecondaryWhite h-fit w-[80%] m-5 rounded-md">
              {dummyJson?.case_outcome}
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

        {console.log(data)}

        <div className="pt-4 px-6 rounded-xl">
          <h1 className="text-3xl py-2 font-extrabold dark:text-white text-black">
            Law:
          </h1>

          <ul style={{ listStyle: "none", padding: 0 }}>
            {lsi && Object.keys(lsi).map((key) => (
              <li key={key} style={{ marginBottom: "10px" }}>
                {/* Button for Key */}
                <button
                  onClick={() => toggleKey(key)}
                  style={{
                    background: selectedKey === key ? "#393939" : "#494949",
                    border: "none",
                    padding: "10px",
                    width: "100%",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  {key}
                </button>

                {/* Dropdown Content */}
                <div
                  style={{
                    maxHeight: selectedKey === key ? "500px" : "0",
                    overflow: "hidden",
                    transition: "max-height 0.3s ease",
                    background: "#f4f4f4",
                    padding: selectedKey === key ? "10px" : "0",
                    border: selectedKey === key ? "1px solid #ccc" : "none",
                    borderTop: "none",
                  }}
                >
                  {selectedKey === key && (
                    <div
                      dangerouslySetInnerHTML={{ __html: legalStatutes[key] }}
                    />
                  )}
                </div>
              </li>
            ))}
          </ul>
          {/* Display description */}
          <div>
            {selectedKey ? (
              <div className="h-[100vh] min-w-[300px] fixed right-0">
                <h2>{selectedKey}</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: dummyJson?.legalStatute[selectedKey],
                  }}
                />
              </div>
            ) : (
              <p>Select an item to see the details.</p>
            )}
          </div>
        </div>

        {paths && paths.length > 0 && (
          <div className="mt-4 pl-4">
            <h4 className="dark:text-gray-400 text-DarkBlue text-lg mb-2">
              Prior Case Retrieval
            </h4>
            <div className="space-y-2">
              {dummyJson?.paths.map((path, index) => (
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
