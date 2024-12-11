import { ChatInput } from "./chat-input";
import { UserMessage } from "./user-message";


import chatTriangler from "../../assets/svgs/chat-triangle.svg";
import logo from "../../assets/svgs/logo.svg";


export function ChatArea({ messages, onSend ,handleStateChange}) {
  return (
    <div className="flex-1 flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-7 space-y-6">
        {messages &&
          messages.length > 0 &&
          messages.map((message) => (
            
            <div>
              {message.isUser ? (
                <UserMessage content={message.content} user={message.user} />
              ) : (
                <Message content={message.content} sources={message.sources} stateChange={handleStateChange}  />
              )}
            </div>
          ))}
      </div>
      <ChatInput onSend={onSend} />
    </div>
  );
}

 function Message({ content, sources ,stateChange }) {
  return (
    <div
      className={`flex  justify-start
       mb-4 bg-PrimaryGrayDark pt-4 pb-8 pr-10 pl-6 rounded-xl`}
    >
      <div className="max-w-6xl flex ">
        <div className="mt-2.5 mr-1">
          <img src={logo} alt="logo" width={69} />
        </div>
        <div className="flex space-x-3 justify-start items-center">
          <div>
            <div className=" rounded-lg px-4 py-3">
              {sources && (
                <h1 className="text-PrimaryGrayTextDark">LawVista AI</h1>
              )}
              <p className="text-gray-200 whitespace-pre-wrap">{content}</p>
            </div>

            {sources && sources.length > 0 && (
              <div className="mt-4 pl-4">
                <h4 className="text-gray-400 text-sm mb-2">Sources</h4>
                <div className="space-y-2">
                  {sources.map((source, index) => (
                    <div
                      key={index}
                      className="bg-PrimaryGrayLight rounded-xl p-3 flex justify-between items-center"
                      onClick={()=>stateChange(source.id)}
                    >
                      <div>
                        <h5 className="text-gray-200">{source.title}</h5>
                        <p className="text-PrimaryGrayTextDark text-sm">
                          {source.subtitle}
                        </p>
                      </div>
                      <button
                        onClick={source.onView}
                        className="px-5 py-2 text-sm bg-PrimaryGrayLighter text-gray-200 rounded-xl hover:bg-PrimaryGrayDark/30 transition-colors flex justify-center items-center space-x-1 gap-2 "
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
      </div>
    </div>
  );
}
