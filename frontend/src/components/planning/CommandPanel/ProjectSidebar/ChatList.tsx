import React from "react";

interface Props {
  chats: { id: number; title: string }[];
  selectedChatId: number | null;
  onSelectChat: (id: number) => void;
}

const ChatList: React.FC<Props> = ({ chats, selectedChatId, onSelectChat }) => (
  <ul className="space-y-2">
    {chats.map((chat) => (
      <li key={chat.id}>
        <button
          className={`w-full text-left px-2 py-1 rounded hover:bg-blue-100 dark:hover:bg-blue-800 ${
            selectedChatId === chat.id
              ? "bg-blue-200 dark:bg-blue-700 text-white"
              : ""
          }`}
          onClick={() => onSelectChat(chat.id)}
        >
          {chat.title || `Chat ${chat.id}`}
        </button>
      </li>
    ))}
  </ul>
);

export default ChatList;
