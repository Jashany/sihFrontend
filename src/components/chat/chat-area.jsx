import { ChatInput } from "./chat-input";
import { UserMessage } from "./user-message";
import chatTriangler from "../../assets/svgs/chat-triangle.svg";
import logo from "../../assets/logoSih.svg";
import { useState, useEffect, useRef } from "react";
import { translateToLanguage } from "../../services/LanguageEnglish";
import TextToSpeech from "../../utils/TextToSpeech";

// Main Component that orchestrates the chat display
export function ChatArea({ messages, onSend, handleStateChange }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return (
    <div className="flex-1 relative flex flex-col h-screen">
      <div className="h-[70px] absolute top-0 w-full bg-"></div>
      {/* Responsive Padding: Reduced padding on mobile (p-4) and increased on larger screens (sm:p-7) */}
      {/* Responsive Spacing: Reduced space between messages on mobile (space-y-4) */}
      <div className="flex-1 overflow-y-auto p-4 mt-[70px] lg:mt-0 sm:p-7 space-y-4 sm:space-y-6 ">
        {messages &&
          messages.length > 0 &&
          messages.map((message, index) => (
            <div key={message.timestamp || index}> {/* Use a stable key */}
              {message.user ? (
                // Renders the user's message
                <UserMessage content={message.user} user={message.user} />
              ) : (
                // Renders the AI's message
                <Message
                  content={message.ai.text}
                  sources={message.ai.sources}
                  stateChange={handleStateChange}
                  isStreaming={message.isStreaming} // Pass the streaming flag down
                />
              )}
            </div>
          ))}
        {/* This div acts as a scroll target for auto-scrolling to the bottom */}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSend={onSend} />
    </div>
  );
}

// Sub-component for rendering a single AI message
function Message({ content, sources, stateChange, isStreaming }) {
  const [translatedContent, setTranslatedContent] = useState(content);
  const [translationLoading, setTranslationLoading] = useState(false);
  const targetLang = localStorage.getItem("targetLanguage") || "hi"; // Default to Hindi

  useEffect(() => {
    const translateContent = async () => {
      if (!content || content.trim() === "") return;
      setTranslationLoading(true);
      try {
        const translatedText = await translateToLanguage(content, targetLang);
        setTranslatedContent(translatedText);
      } catch (error) {
        console.error("Error translating content:", error);
        setTranslatedContent(content); // Fallback to original content
      }
      setTranslationLoading(false);
    };

    if (isStreaming) {
      setTranslatedContent(content);
      setTranslationLoading(false);
    } else {
      translateContent();
    }
  }, [content, isStreaming, targetLang]);

  const BlinkingCursor = () => <span className="inline-block w-2 h-5 bg-gray-700 dark:bg-gray-300 animate-pulse ml-1" aria-hidden="true"></span>;

  return (
    // Responsive Padding: Simplified padding for all screen sizes (p-4), with more specific padding for larger screens.
    <div className={`flex justify-start mb-4 dark:bg-PrimaryGrayDark bg-SecondaryWhite p-4 sm:pt-4 sm:pb-8 sm:pr-10 sm:pl-6 rounded-xl`}>
      <div className="max-w-6xl flex items-start">
        {/* Responsive Logo: Hidden on mobile (hidden) to save space, visible on larger screens (sm:block) */}
        <div className="hidden sm:block mt-2.5 mr-2">
          <img src={logo} alt="logo" className="w-12 h-12 bg-DarkBlue dark:bg-PrimaryGrayLight p-1 rounded-full" />
        </div>
        <div className="flex space-x-3 justify-start items-center">
          <div>
            <div className="rounded-lg px-2 py-1 sm:px-4 sm:py-3">
              <div className="flex items-center gap-3 sm:gap-5">
                <h1 className="dark:text-PrimaryGrayTextDark text-DarkBlue text-lg font-semibold">LawVista AI</h1>
                {!isStreaming && content && (
                   <div className="my-2"><TextToSpeech text={content} /></div>
                )}
              </div>
              
              <p className="dark:text-gray-200 text-PrimaryGrayDark whitespace-pre-wrap mt-2">
                {translationLoading ? "Translating..." : translatedContent}
                {isStreaming && <BlinkingCursor />}
              </p>
            </div>

            {sources && sources.length > 0 && (
              <div className="mt-4 pl-2 sm:pl-4">
                <h4 className="dark:text-gray-400 text-DarkBlue text-sm mb-2">Sources</h4>
                <div className="space-y-3">
                  {sources.map((source, index) => {
                    const individualSourcePath = source.split(".")[0] || "";
                    return (
                      // Responsive Layout: Stacked vertically on mobile (flex-col), row on larger screens (sm:flex-row).
                      <div
                        key={index}
                        className="dark:bg-PrimaryGrayLight bg-[#DBE4FF] rounded-xl p-3 flex flex-col items-start gap-3 sm:flex-row sm:justify-between sm:items-center cursor-pointer"
                        onClick={() => stateChange(individualSourcePath)}
                      >
                        <div>
                          <h5 className="dark:text-gray-200 text-PrimaryGrayDark font-medium">{source}</h5>
                          <p className="dark:text-PrimaryGrayTextDark text-PrimaryGrayLighter text-sm">
                            {source}
                          </p>
                        </div>
                        {/* Responsive Button: Full width on mobile (w-full) for easy tapping, auto width on larger screens (sm:w-auto). */}
                        <div className="w-full sm:w-auto px-4 py-2 text-sm dark:bg-PrimaryGrayLighter bg-[#8AA6FA] text-gray-200 rounded-xl hover:bg-PrimaryGrayDark/30 transition-colors flex justify-center items-center gap-2">
                          <img
                            src={chatTriangler}
                            alt="chat"
                            width={15}
                            height={10}
                          />
                          <span>View Document</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}