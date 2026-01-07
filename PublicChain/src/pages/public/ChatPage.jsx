import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../../components/Sidebar";

// ⚠️ YOUR WORKING KEY (Kept exactly as requested)
const API_KEY = "AIzaSyC9Tw1CaCTERZWMCNMG40c_WIUFDSImRfA";

const ChatPage = () => {
  // ---------------------------------------------------------
  // 1. LOGIC SECTION (Kept Exactly as your original code)
  // ---------------------------------------------------------
  const [messages, setMessages] = useState([
    {
      text: "Hello! I am your AI Medical Assistant. How can I help you with your research today?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Model Management
  const [models, setModels] = useState([]);
  // DEFAULT TO HARDCODED FLASH
  const [selectedModel, setSelectedModel] = useState("models/gemini-1.5-flash");

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // FETCH MODELS
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
        );
        const data = await response.json();

        const chatModels = (data.models || []).filter((m) =>
          m.supportedGenerationMethods.includes("generateContent")
        );
        setModels(chatModels);

        const flashModel = chatModels.find(
          (m) => m.name === "models/gemini-1.5-flash"
        );

        if (flashModel) {
          setSelectedModel(flashModel.name);
          console.log("✅ Forced connection to Free Tier:", flashModel.name);
        } else {
          const otherFlash = chatModels.find((m) => m.name.includes("flash"));
          if (otherFlash) setSelectedModel(otherFlash.name);
        }
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };
    fetchModels();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newUserMsg = { text: input, sender: "user" };
    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const history = messages
        .filter((msg) => msg.sender !== "bot" || !msg.text.includes("Error"))
        .map((msg) => ({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        }));

      const fullHistory = [
        ...history,
        { role: "user", parts: [{ text: newUserMsg.text }] },
      ];

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/${selectedModel}:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: fullHistory }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const errMsg = data.error?.message || "Unknown Error";
        if (errMsg.includes("429") || errMsg.includes("Quota")) {
          throw new Error(
            "Quota Exceeded on this model. Please switch to 'gemini-1.5-flash' in the dropdown."
          );
        }
        throw new Error(errMsg);
      }

      const botText =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "No response text.";
      setMessages((prev) => [...prev, { text: botText, sender: "bot" }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: `⚠️ ${error.message}`,
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    if (!isLoading) handleSend();
  };

  // ---------------------------------------------------------
  // 2. DESIGN SECTION (Updated fixes)
  // ---------------------------------------------------------
  return (
    <div className="min-h-screen w-full flex bg-slate-100 text-gray-900">
      {/* Public Sidebar */}
      <Sidebar active="ChatPage" />

      {/* Main content */}
      <main className="flex-1 p-6 lg:p-10 max-w-6xl mx-auto bg-white border-l border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Chatbot</h1>
            <p className="text-xs text-gray-600 mt-1">
              Ask questions and get concise answers. Select a model if needed.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-gray-600">Model</label>
            <select
              className="bg-white border border-gray-300 text-gray-800 text-xs rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-600"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              {models.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.displayName || m.name.replace("models/", "")}
                  {m.name.includes("flash") ? " (Free)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Chat card */}
        <div className="rounded-md border border-gray-200 bg-white shadow-sm flex flex-col h-[70vh]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg, index) => {
              const isUser = msg.sender === "user";
              return (
                <div
                  key={index}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl border text-sm shadow-sm ${
                      isUser
                        ? "bg-blue-50 border-blue-200 text-blue-900 rounded-br-sm"
                        : "bg-gray-50 border-gray-200 text-gray-800 rounded-bl-sm"
                    }`}
                  >
                    <div className="text-[10px] font-medium text-gray-500 mb-1 uppercase tracking-wider">
                      {isUser ? "You" : "Assistant"}
                    </div>
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="text-xs text-gray-600">Processing…</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={onFormSubmit} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                placeholder="Type your message…"
                className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 rounded bg-blue-700 text-white text-sm font-medium hover:bg-blue-800 disabled:opacity-60"
              >
                {isLoading ? "Sending…" : "Send"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
