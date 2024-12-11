import deleteicon from "../../assets/svgs/delete.svg";

export function ChatListItem({ title, subtitle, isActive, onClick, onDelete }) {
  return (
    <button
      onClick={onClick}
      className={`relative w-[95%] text-left pb-2 px-4 pt-3 transition-colors rounded-xl ${
        isActive
          ? "bg-PrimaryGrayHover hover:bg-PrimaryGrayLight"
          : "bg-PrimaryGrayDark hover:bg-PrimaryGrayLight"
      }`}
    >

      {
        isActive && (
          <img
        src={deleteicon}
        alt="del"
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering the button's onClick
          onDelete();
        }}
        className="absolute top-2 right-2 cursor-pointer"
      />
        )
      }
      
      <h3 className="text-white font-medium truncate">{title}</h3>
      <p
        className={`text-sm pt-1 truncate ${
          isActive ? "text-white" : "text-PrimaryGrayTextLight"
        }`}
      >
        {subtitle}
      </p>
    </button>
  );
}
