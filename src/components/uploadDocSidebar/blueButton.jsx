import { useRef } from "react"

const UploadButton = ({ name, svg }) => {
  const fileInput = useRef();

  const handleClick = () => {
    if(fileInput.current) {
      fileInput.current.click();
    }
  }

  return (
    <button className="bg-PrimaryBlue px-5 py-1.5 rounded-md flex w-full justify-center items-center gap-2 hover:bg-blue-500 transition-colors" onClick={handleClick}>
        {name}
        <img src={svg} alt="chat" width={18} height={10} />
        <input type="file" className="hidden" ref={fileInput}  accept=".pdf, .doc, .docx" />
    </button>
  )
}

export default UploadButton
