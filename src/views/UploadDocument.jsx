import { act, useState } from "react";
import { Sidebar } from "../components/uploadDocSidebar/sidebar";
import SummarySection from "../components/uploadDocSidebar/summary-section";

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

  const activeDoc = docs.find(doc => doc.id === activeDocId);

  return (
    <div className="flex bg-PrimaryBlack text-gray-200 h-screen">
      <Sidebar
        activeDocId={activeDocId}
        docs={docs}
        onDocSelect={setActiveDocId}
      />
      <SummarySection document={activeDoc} />
    </div>
  );
};

export default UploadDocument;
