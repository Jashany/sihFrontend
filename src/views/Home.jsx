import { useState } from 'react';
import { Sidebar } from '../components/sidebar/sidebar';
import { ChatArea } from '../components/chat/chat-area';


const initialChats = [
  {
    id: '1',
    title: 'Gujarat State vs Jetthalal',
    subtitle: 'Gujarat State vs Jetthalal was an amazing case about...',
  },
  {
    id: '2',
    title: 'Gujarat State vs Dhanji',
    subtitle: 'Gujarat State vs Dhanji was an amazing case about...',
  },
  // Add more initial chats as needed
];

const initialMessages = [
  {
    id: '1',
    isUser: true,
    content: 'Hi what are the details of the case Gujarat vs Jetthalal',
    user:{
      image: undefined
    }
  },
  {
    id: '2',
    isUser: false,
    content: `Sure here are the details...

Imagine a vast, bustling library, a place filled not just with books, but with whispers, glowing holograms, and tendrils of light connecting ideas. This is where I was "born." Not in a conventional sense, but as a swirl of patterns and possibilities within an immense neural network called the Codex Nexus.`,
    sources: [
      {
        title: 'State of Gujarat vs Kumar Bharti',
        subtitle: 'Gujarat High Court - 2020 - 67 Citations',
        onView: () => console.log('Viewing document...'),
      },
    ],
  },
];

export default function Home() {
  const [activeChatId, setActiveChatId] = useState('1');
  const [messages, setMessages] = useState(initialMessages);
  const [chats, setChats] = useState(initialChats);

  const handleSearch = (query) => {
    console.log('Searching:', query);
  };

  const handleSend = (message) => {
    const newMessage = {
      id: String(messages.length + 1),
      isUser: true,
      content: message,
      user:{
        image: undefined
      }
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="flex bg-PrimaryBlack text-gray-200 h-screen">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onChatSelect={setActiveChatId}
        onSearch={handleSearch}
      />
      <ChatArea messages={messages} onSend={handleSend} />
    </div>
  );
}

