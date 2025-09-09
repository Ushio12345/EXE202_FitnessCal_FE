import React, { useState } from "react";

interface ChatMessage {
  role: "user" | "ai";
  content: string;
}

const ChatAI: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);

  const handleSendPrompt = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;
    setChat(prev => [...prev, { role: "user", content: prompt }]);
    setIsSending(true);
    // TODO: Gọi API AI ở đây, tạm thời trả về câu trả lời mẫu
    setTimeout(() => {
      setChat(prev => [...prev, { role: "ai", content: "Đây là câu trả lời mẫu từ AI. (Tích hợp API sau)" }]);
      setIsSending(false);
    }, 1000);
    setPrompt("");
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col gap-4 w-full max-w-2xl max-h-[70vh] transition-colors duration-300">
      <div className="font-semibold text-indigo-700 dark:text-indigo-200 mb-2 text-xl text-center">FitnessCalAI</div>
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto min-h-[200px]">
        {chat.length === 0 && <div className="text-gray-400 text-sm text-center">Hãy nhập câu hỏi của bạn...</div>}
        {chat.map((msg, idx) => (
          <div key={idx} className={msg.role === "user" ? "text-right" : "text-left"}>
            <span className={msg.role === "user" ? "inline-block bg-indigo-100 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-100 rounded-lg px-4 py-2 mb-1 max-w-[80%]" : "inline-block bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-2 mb-1 max-w-[80%]"}>
              {msg.content}
            </span>
          </div>
        ))}
        {isSending && <div className="text-xs text-gray-400 italic text-center">Đang gửi...</div>}
      </div>
      <form className="flex gap-2 mt-2" onSubmit={handleSendPrompt}>
        <input
          type="text"
          className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 px-5 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base"
          placeholder="Nhập câu hỏi..."
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          disabled={isSending}
          style={{ minWidth: 0 }}
        />
        <button
          type="submit"
          className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 transition-all text-base"
          disabled={isSending || !prompt.trim()}
        >Gửi</button>
      </form>
    </div>
  );
};

export default ChatAI;
