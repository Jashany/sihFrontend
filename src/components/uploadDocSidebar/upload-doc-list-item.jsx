import fileText from '../../assets/svgs/file-text.svg'
import deleteicon from "../../assets/svgs/delete.svg";

const DocumentListItem = ({ title, onClick, isActive }) => {
  return (
    <div className='my-3'>
      <button
        onClick={onClick}
        className={`relative w-[95%] text-left pb-2 px-4 pt-3 transition-colors rounded-xl flex items-center gap-2 ${
          isActive
            ? "bg-PrimaryGrayHover hover:bg-PrimaryGrayLight"
            : "bg-PrimaryGrayDark hover:bg-PrimaryGrayLight"
        }`}
      >
        <img src={fileText} width={18} height={18} />
        <h3 className="text-white font-medium truncate">{title}</h3>

        {
        isActive && (
          <img
        src={deleteicon}
        alt="del"
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering the button's onClick
          onDelete();
        }}
        className="cursor-pointer ml-auto"
      />
        )
      }
      </button>
    </div>
  );
};

export default DocumentListItem;
