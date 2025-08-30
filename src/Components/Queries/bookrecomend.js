"use client";
import { useContext, useEffect, useState, useRef } from "react";
import { Send, BookOpen, User, Bot, X, MessageCircle, Minimize2 } from "lucide-react";
import UserContext from "../../Hooks/UserContext";
import "./bookrecomend.css";

const BookRecommendChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [papersReady, setPapersReady] = useState(false);
  const [paperNames, setPaperNames] = useState(() => {
  // Initialize from localStorage
  if (typeof window !== "undefined") {
    return localStorage.getItem("paperNames") || null;
  }
  return null;
});
  const context = useContext(UserContext);
  const { user, paperList = [] } = context || {};
  const user_id = user?._id;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

useEffect(() => {
  if (paperList && paperList.length > 0 && !papersReady) {
    const names = paperList.map((p) => p.paper).join(", ");
    setPaperNames(names);
    localStorage.setItem("paperNames", names); // ✅ Save to localStorage
    setPapersReady(true);
    console.log("📚 PaperList ready:", names);
  }
}, [paperList, papersReady]);

  useEffect(() => {
    if (paperList.length > 0) {
       localStorage.setItem("paperNames", paperNames); 
      console.log("✅ Paper Names:", paperNames);
    } else {
      console.log("❌ Paper list empty or not loaded yet.");
    }
  }, [paperList,paperNames]);

  if (!context) {
    console.error("UserContext not available");
    return <div>Unable to load chatbot.</div>;
  }

  const handleInputChange = (e) => setInput(e.target.value);

 const handleSubmit = async (e) => {
  e.preventDefault();

  const storedPaperNames =
    paperNames || localStorage.getItem("paperNames") || "";

  console.log("📘 Used Paper Names:", storedPaperNames);

  if (!input.trim() || isLoading) return;

  const userMessage = input.trim();
  setInput("");

  setMessages((prev) => [
    ...prev,
    { id: Date.now(), role: "user", content: userMessage },
  ]);
  setIsLoading(true);

  if (!storedPaperNames) {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        role: "assistant",
        content: "Please wait while we load your subjects. Try again shortly!",
      },
    ]);
    setIsLoading(false);
    return;
  }

  try {
    const API_KEY = "AIzaSyA8WX4aYSc_WIzNgC7DclS_pt4GTF8MKGE";
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `
You are a helpful and knowledgeable book assistant librarian named Shiksha Setu AI.
The user is studying the following papers: ${storedPaperNames}.
Always recommend books or useful resources based on the context or user question.
and for listing use numbering avoid asterisk.
dont use asterisk at all in response use "".
If no direct match is found with the user's subjects or question, still provide relevant educational suggestions and reply helpfully.

User: ${userMessage}
`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const assistantReply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

 const fallbackReply = `
Hmm, I couldn't fetch a response right now. But here's something useful for your day:

"Stay consistent, even on small goals. Success is a result of daily habits."

Feel free to ask for book recommendations or help with study tips, motivation, or your daily tasks! 💡
`;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        role: "assistant",
        content: assistantReply || fallbackReply,
      },
    ]);
  } catch (error) {
    console.error("Error:", error);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        role: "assistant",
        content:
          "Oops! Something went wrong. But here's a book you might enjoy: 'The Pragmatic Programmer'. Ask me anything else! 📘",
      },
    ]);
  } finally {
    setIsLoading(false);
  }
};


  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const minimizeChat = () => setIsMinimized(true);
  const restoreChat = () => setIsMinimized(false);

  return (
    <>
      {!isOpen && (
        <div className="floating-button-container">
          <button onClick={toggleChat} className="floating-chat-button">
            <MessageCircle className="floating-button-icon" />
          </button>
          <div className="notification-badge">
            <BookOpen className="badge-icon" />
          </div>
        </div>
      )}

      {isOpen && (
        <div className="chat-window-container">
          <div className="chat-blur-background">
            <div className="blur-circle blur-circle-1"></div>
            <div className="blur-circle blur-circle-2"></div>
          </div>

          <div className={`chat-card ${isMinimized ? "minimized" : ""}`}>
            <div className="chat-header">
              <div className="header-content">
                <div className="header-info">
                  <div className="header-avatar">
                    <BookOpen className="avatar-icon" />
                  </div>
                  <div className="header-text">
                    <div className="header-title">Book Assistant</div>
                    <div className="header-subtitle">Shiksha Setu AI</div>
                  </div>
                </div>
                <div className="header-controls">
                  <button
                    onClick={isMinimized ? restoreChat : minimizeChat}
                    className="control-button"
                  >
                    <Minimize2 className="control-icon" />
                  </button>
                  <button onClick={toggleChat} className="control-button">
                    <X className="control-icon" />
                  </button>
                </div>
              </div>
            </div>

            {!isMinimized && (
              <>
                <div className="chat-content">
                  {messages.length === 0 && (
                    <div className="welcome-message">
                      <BookOpen className="welcome-icon" />
                      <h3 className="welcome-title">Welcome! 📚</h3>
                      <p className="welcome-text">
                        Ask me for book recommendations based on your subject or academic level!
                      </p>
                      <div className="example-prompts">
                        <div
                          className="example-prompt"
                          onClick={() => setInput("Best books for CSE students")}
                        >
                          "Best books for CSE students"
                        </div>
                        <div
                          className="example-prompt"
                          onClick={() => setInput("Math books for class 12")}
                        >
                          "Math books for class 12"
                        </div>
                      </div>
                    </div>
                  )}

                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`message-container ${message.role}-message`}
                    >
                      <div className={`message-wrapper ${message.role}-wrapper`}>
                        <div className={`message-avatar ${message.role}-avatar`}>
                          {message.role === "user" ? (
                            <User className="message-icon" />
                          ) : (
                            <Bot className="message-icon" />
                          )}
                        </div>
                        <div className={`message-bubble ${message.role}-bubble`}>
                          <div className="message-text">{message.content}</div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="message-container bot-message">
                      <div className="message-wrapper bot-wrapper">
                        <div className="message-avatar bot-avatar">
                          <Bot className="message-icon" />
                        </div>
                        <div className="message-bubble bot-bubble">
                          <div className="typing-indicator">
                            <div className="typing-dot"></div>
                            <div className="typing-dot typing-dot-2"></div>
                            <div className="typing-dot typing-dot-3"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="chat-footer">
                  <form onSubmit={handleSubmit} className="chat-form">
                    <input
                      value={input}
                      onChange={handleInputChange}
                      placeholder={
                        !papersReady ? "Loading your subjects..." : "Ask for books..."
                      }
                      className="chat-input"
                      // disabled={isLoading || !papersReady}
                    />
                    <button
                      type="submit"
                      // disabled={isLoading || !input.trim() || !papersReady}
                      className="send-button"
                    >
                      <Send className="send-icon" />
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BookRecommendChatbot;
