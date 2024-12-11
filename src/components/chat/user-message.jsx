import chatTriangler from "../../assets/svgs/chat-triangle.svg";
import {User} from "lucide-react"
import logo from "../../assets/svgs/logo.svg";

export function UserMessage({ content, user }) {
  return (
    <div
      className={`flex justify-start
        bg-PrimaryGrayDark  rounded-xl pb-3 pt-1 `}
    >
      <div className="max-w-6xl flex justify-center items-center gap-2 pl-6 ">
        <div className="">
          { user.image ? (
            <img src={user.image} alt="logo" width={40} />
          ) : (
            <User size={30} />
          )}
        </div>
        <div className="flex space-x-3 justify-start items-center">
          <div>
            <div className=" rounded-lg px-4 py-3">
              <h1 className="text-PrimaryGrayTextDark">You</h1>
              <p className="text-gray-200 whitespace-pre-wrap">{content}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
