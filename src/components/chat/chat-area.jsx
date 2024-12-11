import { Message } from "./ai-message";
import { ChatInput } from "./chat-input";
import { UserMessage } from "./user-message";

export function ChatArea({ messages, onSend }) {
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
                <Message content={message.content} sources={message.sources} />
              )}
            </div>
          ))}
      </div>
      <ChatInput onSend={onSend} />
    </div>
  );
}
